import Slot from "../models/slot.model.js";
import Appointment from "../models/appointment.model.js";
import { ApiError } from "../utils/ApiError.js";

class SlotService {
  /**
   * Create multiple slots for a doctor
   * @param {Object} params
   * @param {string} params.doctorId - Doctor's ID
   * @param {Date} params.date - Date for slots
   * @param {Array<{startTime: string, endTime: string}>} params.timeSlots - Array of time slots
   */

  async createDoctorSlots(params) {
    try {
      const { doctorId, date, timeSlots } = params;

      // Validate if slots already exist
      const existingSlots = await Slot.find({
        doctorId,
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lte: new Date(date.setHours(23, 59, 59, 999)),
        },
      });

      if (existingSlots.length > 0) {
        throw new ApiError(400, "Slots already exist for this date");
      }

      // Create slots
      const slotsToCreate = timeSlots.map((slot) => ({
        doctorId,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false,
      }));

      const createdSlots = await Slot.insertMany(slotsToCreate);

      return createdSlots;
    } catch (error) {
      console.error("Error creating doctor slots:", error);
      throw new ApiError(500, "Failed to create doctor slots");
    }
  }

  /**
   * Find available slots of a doctor
   * @param {Object} params
   * @param {string} params.doctorId - Doctor's ID
   * @param {Date} params.startDate - Start date for search
   * @param {Date} params.endDate - End date for search
   */

  async findAvailableSlots(params) {
    try {
      const { doctorId, startDate, endDate } = params;

      // getting available slots
      const availableSlots = await Slot.find({
        doctorId,
        date: {
          $gte: new Date(startDate.setHours(0, 0, 0, 0)),
          $lte: new Date(endDate.setHours(23, 59, 59, 999)),
        },
        isBooked: false,
      }).sort({ date: 1, startTime: 1 });

      return availableSlots;
    } catch (error) {
      console.error("Error finding available slots:", error);
      throw new ApiError(500, "Failed to find available slots");
    }
  }

  /**
   * Book a specific slot
   * @param {string} slotId - Slot ID to book
   * @param {string} appointmentId - Appointment ID
   */
  async bookSlot(slotId, appointmentId) {
    try {
      const slot = await Slot.findById(slotId);

      if (!slot) {
        throw new ApiError(400, "Slot not found");
      }

      if (slot.isBooked) {
        throw new ApiError(400, "Slot is already booked");
      }

      slot.isBooked = true;
      slot.appointmentId = appointmentId;
      await slot.save();

      return slot;
    } catch (error) {
      console.error("Error booking slot:", error);
      throw new ApiError(500, "Failed to book slot");
    }
  }

  /**
   * Release a booked slot
   * @param {string} slotId - Slot ID to release
   */
  async releaseSlot(slotId) {
    try {
      const slot = await Slot.findById(slotId);

      if (!slot) {
        throw new ApiError(400, "Slot not found");
      }

      slot.isBooked = false;
      slot.appointmentId = null;
      await slot.save();

      return slot;
    } catch (error) {
      console.error("Error releasing slot:", error);
      throw new ApiError(500, "Failed to release slot");
    }
  }

  /**
   * Find next available slots for rescheduling
   * @param {Object} params
   * @param {string} params.doctorId - Doctor's ID
   * @param {number} params.numberOfSlots - Number of slots to find
   * @param {Date} params.afterDate - Find slots after this date
   */
  async findNextAvailableSlots(params) {
    try {
      const { doctorId, numberOfSlots = 5, afterDate = new Date() } = params;

      const availableSlots = await Slot.find({
        doctorId,
        date: { $gte: afterDate },
        isBooked: false,
      })
        .sort({ date: 1, startTime: 1 })
        .limit(numberOfSlots);

      return availableSlots;
    } catch (error) {
      console.error("Error finding next available slots:", error);
      throw new ApiError(500, "Failed to find next available slots");
    }
  }

  /**
   * Get doctor's schedule for a specific date range
   * @param {Object} params
   * @param {string} params.doctorId - Doctor's ID
   * @param {Date} params.startDate - Start date
   * @param {Date} params.endDate - End date
   */
  async getDoctorSchedule(params) {
    try {
      const { doctorId, startDate, endDate } = params;

      const schedule = await Slot.find({
        doctorId,
        date: {
          $gte: new Date(startDate.setHours(0, 0, 0, 0)),
          $lte: new Date(endDate.setHours(23, 59, 59, 999)),
        },
      })
        .populate("appointmentId")
        .sort({ date: 1, startTime: 1 });

      return schedule;
    } catch (error) {
      console.error("Error getting doctor schedule:", error);
      throw new ApiError(500, "Failed to get doctor schedule");
    }
  }

  /**
   * Check slot availability
   * @param {Object} params
   * @param {string} params.doctorId - Doctor's ID
   * @param {Date} params.date - Date to check
   * @param {string} params.startTime - Start time
   * @param {string} params.endTime - End time
   */
  async checkSlotAvailability(params) {
    try {
      const { doctorId, date, startTime, endTime } = params;

      const conflictingSlot = await Slot.findOne({
        doctorId,
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lte: new Date(date.setHours(23, 59, 59, 999)),
        },
        startTime: startTime,
        endTime: endTime,
        isBooked: true,
      });

      return !conflictingSlot;
    } catch (error) {
      console.error("Error checking slot availability:", error);
      throw new ApiError(500, "Failed to check slot availability");
    }
  }

  /**
   * Bulk create slots for multiple days
   * @param {Object} params
   * @param {string} params.doctorId - Doctor's ID
   * @param {Date} params.startDate - Start date
   * @param {Date} params.endDate - End date
   * @param {Array<{startTime: string, endTime: string}>} params.timeSlots - Array of time slots
   */
  async bulkCreateSlots(params) {
    try {
      const { doctorId, startDate, endDate, timeSlots } = params;
      const slots = [];

      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        timeSlots.forEach((slot) => {
          slots.push({
            doctorId,
            date: new Date(date),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false,
          });
        });
      }

      const createdSlots = await Slot.insertMany(slots);
      return createdSlots;
    } catch (error) {
      console.error("Error bulk creating slots:", error);
      throw error;
    }
  }

  /**
   * Delete expired slots
   * @param {Date} beforeDate - Delete slots before this date
   */
  async deleteExpiredSlots(beforeDate) {
    try {
      const result = await Slot.deleteMany({
        date: { $lt: beforeDate },
        isBooked: false,
      });

      return result;
    } catch (error) {
      console.error("Error deleting expired slots:", error);
      throw error;
    }
  }

  // Get all slots for a doctor
}

const slotService = new SlotService();
export default slotService;