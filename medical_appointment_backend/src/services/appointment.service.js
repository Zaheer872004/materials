import Appointment from "../models/appointment.model.js";
import notificationService from "./notification.service.js";
import slotService from "./slot.service.js";
import { serviceAsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


class AppointmentService {
  // Check for no-shows (should be run every minute via a scheduler)
  checkNoShows = serviceAsyncHandler(async () => {
    const currentTime = new Date();
    const fifteenMinutesAgo = new Date(currentTime - 15 * 60 * 1000);

    // Find appointments that:
    // 1. Are scheduled for today
    // 2. Started more than 15 minutes ago
    // 3. Are still in "scheduled" status

    try {
      const missedAppointments = Appointment.find({
        status: "scheduled",
        date: {
          $gte: new Date(currentTime.setHours(0, 0, 0, 0)),
          $lte: new Date(currentTime.setHours(23, 59, 59, 999)),
        },
        startTime: {
          $lte: fifteenMinutesAgo.toTimeString().slice(0, 5),
        },
        noShowRecorded: null,
      }).exec();

      // for (const appointment of missedAppointments) {
      //   await this.markAsNoShow(appointment._id);
      // }

      if (missedAppointments.length > 0) {
        for (const appointment of missedAppointments) {
          await this.markAsNoShow(appointment._id);
        }
      } else {
        console.info("No missed appointments found.");
      }

      // console.log(missedAppointments)
      return missedAppointments;
    } catch (error) {
      console.log(error);
      throw new ApiError(500,"Failed to check for missed appointments");
    }
  });

  // Mark an appointment as missed and trigger rescheduling process
  markAsNoShow = serviceAsyncHandler(async (appointmentId) => {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "missed",
        noShowRecorded: new Date(),
      },
      { new: true }
    );

    if (appointment) {
      // find available slot for rescheduling
      const availableSlot = await this.findRescheduleSlots(appointment);

      // send notification to patient about the new slot available
      await notificationService.sendNoShowNotification(
        appointment,
        availableSlot
      );

      return appointment;
    }
    throw new ApiError(404,"Appointment not found" );
  });

  // Find available slots for rescheduling
  findRescheduleSlots = serviceAsyncHandler(async (appointment) => {
    const today = new Date();

    // making dates for the next 3 days
    const nextThreeDays = Array.from({ length: 3 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 1);
      return date;
    });

    try {
      const availableSlots = await slotService.findAvailableSlots({
        doctorId: appointment.doctorId,
        dates: nextThreeDays,
      });

      return availableSlots;
    } catch (error) {
      console.error("Error finding rescheduling slots:", error);
      throw new ApiError("Failed to find rescheduling slots", 500);
    }
  });

  // Reschedule an appointment
  rescheduleAppointment = serviceAsyncHandler(
    async (oldAppointmentId, newSlot) => {
      // here the database transition start
      const session = await Appointment.startSession();
      session.startTransaction();

      try {
        // get previous appointment | original appointment
        const oldAppointment = await Appointment.findById(oldAppointmentId);

        if (!oldAppointment) {
          throw new ApiError("Appointment not found", 404);
        }

        // create new appointment
        const newAppointment = await Appointment.create(
          [
            {
              doctorId: oldAppointment.doctorId,
              patientId: oldAppointment.patientId,
              date: newSlot.date,
              startTime: newSlot.startTime,
              endTime: newSlot.endTime,
              status: "scheduled",
              rescheduledFrom: oldAppointmentId,
            },
          ],
          { session }
        );

        // Update old appointment status
        await Appointment.findByIdAndUpdate(
          oldAppointmentId,
          { status: "rescheduled" },
          { session }
        );

        // Commit the transaction
        await session.commitTransaction();

        // Send confirmation notifications
        await notificationService.sendRescheduleConfirmation({
          appointment: newAppointment[0],
          oldAppointment,
        });

        return newAppointment[0];
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }
  );

  // Get all appointments for a doctor on a specific date
  getDoctorAppointments = serviceAsyncHandler(async (doctorId, date) => {
    try {
      return await Appointment.find({
        doctorId,
        date,
        status: { $ne: "cancelled" },
      }).populate("patientId");
    } catch (error) {
      console.error("Error getting doctor appointments:", error);
      throw error;
    }
  });

  // Cancel an appointment
  async cancelAppointment(appointmentId, reason) {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          status: "cancelled",
        },
        { new: true }
      );

      if (appointment) {
        await notificationService.sendCancellationNotification(
          appointment,
          reason
        );
        return appointment;
      }
      throw new ApiError(404, "Appointment not found");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      throw new ApiError(404, "Appointment Cancellation failed");
    }
  }

  // Create a new appointment
  async createAppointment(appointmentData) {
    try {
      // Check for conflicts
      const conflicts = await this.checkForConflicts(
        appointmentData.doctorId,
        appointmentData.date,
        appointmentData.startTime,
        appointmentData.endTime
      );

      if (conflicts.length > 0) {
        throw new ApiError(400, "Time slot is already booked");
      }

      const appointment = await Appointment.create(appointmentData);

      console.log("till now all clr : ")

      // Send confirmation notification
      await notificationService.sendAppointmentConfirmation(appointment);
      // sendAppointmentConfirmation
      return appointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw new ApiError(500, "Failed to create appointment");
    }
  }

  // Check for conflicting appointments
  async checkForConflicts(doctorId, date, startTime, endTime) {
    try {
      return await Appointment.find({
        doctorId,
        date,
        status: { $in: ["scheduled", "rescheduled"] },
        $or: [
          {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
          },
        ],
      });
    } catch (error) {
      console.error("Error checking conflicts:", error);
      throw new ApiError(500, "Failed to check for conflicts");
    }
  }


}

const appointmentService = new AppointmentService();
export default appointmentService;
