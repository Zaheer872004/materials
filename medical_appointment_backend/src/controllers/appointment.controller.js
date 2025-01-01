import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import appointmentService from "../services/appointment.service.js";
import mongoose,{ isValidObjectId } from "mongoose";

class AppointmentController {
  // Create new appointment
  createAppointment = asyncHandler(async (req, res) => {
    const { doctorId, patientId, date, startTime, endTime } = req.body;

    if (!doctorId || !patientId || !date || !startTime || !endTime) {
      throw new ApiError(400, "All fields are required");
    }
    
    const appointment = await appointmentService.createAppointment({
      doctorId,
      patientId,
      date,
      startTime,
      endTime,
    });



    return res
      .status(201)
      .json(
        new ApiResponse(201, appointment, "Appointment created successfully")
      );
  });

  // Reschedule appointment
  rescheduleAppointment = asyncHandler(async (req, res) => {
    // const { appointmentId } = req.params;
    const appointmentId = req.params.appointmentId?.replace(':', '');
    const { newSlot } = req.body;

    if (!appointmentId || !newSlot) {
      throw new ApiError(
        400,
        "Appointment ID and new slot details are required"
      );
    }

    const rescheduledAppointment =
      await appointmentService.rescheduleAppointment(appointmentId, newSlot);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          rescheduledAppointment,
          "Appointment rescheduled successfully"
        )
      );
  });

  // Cancel appointment
  cancelAppointment = asyncHandler(async (req, res) => {
    // const { appointmentId } = req.params;
    const appointmentId = req.params.appointmentId?.replace(':', '');
    const { reason } = req.body;

    if (!appointmentId) {
      throw new ApiError(400, "Appointment ID is required");
    }

    if (!reason) {
      throw new ApiError(400, "Cancellation reason is required");
    }

    const cancelledAppointment = await appointmentService.cancelAppointment(
      appointmentId,
      reason
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cancelledAppointment,
          "Appointment cancelled successfully"
        )
      );
  });

  // Get doctor's appointments for a specific date
  getDoctorAppointments = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    // const doctorId = req.params.doctorId?.replace(':', '');
    const { date } = req.query;

    
    if (!doctorId) {
      throw new ApiError(400, "Doctor ID and date are required");
    }

    const appointments = await appointmentService.getDoctorAppointments(
      doctorId,
      new Date(date)
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          appointments,
          "Doctor appointments retrieved successfully"
        )
      );
  });

  // Check appointment availability
  checkAvailability = asyncHandler(async (req, res) => {
    const { doctorId, date, startTime, endTime } = req.body;

    if (!doctorId || !date || !startTime || !endTime) {
      throw new ApiError(400, "All fields are required");
    }

    const conflicts = await appointmentService.checkForConflicts(
      doctorId,
      new Date(date),
      startTime,
      endTime
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isAvailable: conflicts.length === 0 },
          "Availability checked successfully"
        )
      );
  });

  // Mark appointment as no-show
  markAsNoShow = asyncHandler(async (req, res) => {
    // const { appointmentId } = req.params;
    const appointmentId = req.params.appointmentId?.replace(':', '');

    if (!appointmentId) {
      throw new ApiError(400, "Appointment ID is required");
    }

    const markedAppointment = await appointmentService.markAsNoShow(
      appointmentId
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          markedAppointment,
          "Appointment marked as no-show successfully"
        )
      );
  });
}

const appointmentController = new AppointmentController();
export default appointmentController;
