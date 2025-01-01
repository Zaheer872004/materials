import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import slotService from "../services/slot.service.js";

class SlotController {
  // Create slots for a doctor
  createDoctorSlots = asyncHandler(async (req, res) => {
    const { doctorId, date, timeSlots } = req.body;

    if (!doctorId || !date || !timeSlots || !timeSlots.length) {
      throw new ApiError(400, "Doctor ID, date, and time slots are required");
    }

    // Validate time slots format
    timeSlots.forEach((slot) => {
      if (!slot.startTime || !slot.endTime) {
        throw new ApiError(
          400,
          "Each time slot must have startTime and endTime"
        );
      }
    });

    const createdSlots = await slotService.createDoctorSlots({
      doctorId,
      date: new Date(date),
      timeSlots,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, createdSlots, "Doctor slots created successfully")
      );
  });

  // Find available slots
  findAvailableSlots = asyncHandler(async (req, res) => {
    // const { doctorId } = req.params;
    const doctorId = req.params.doctorId?.replace(":", "");
    

    const { startDate, endDate } = req.query;

    if (!doctorId || !startDate || !endDate) {
      throw new ApiError(
        400,
        "Doctor ID, start date, and end date are required"
      );
    }

    const availableSlots = await slotService.findAvailableSlots({
      doctorId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          availableSlots,
          "Available slots retrieved successfully"
        )
      );
  });

  // Book a slot
  bookSlot = asyncHandler(async (req, res) => {
    const { slotId, appointmentId } = req.body;

    if (!slotId || !appointmentId) {
      throw new ApiError(400, "Slot ID and appointment ID are required");
    }

    const bookedSlot = await slotService.bookSlot(slotId, appointmentId);

    return res
      .status(200)
      .json(new ApiResponse(200, bookedSlot, "Slot booked successfully"));
  });

  // Release a slot
  releaseSlot = asyncHandler(async (req, res) => {
    // const { slotId } = req.params;
    const slotId = req.params.slotId?.replace(":", "");

    if (!slotId) {
      throw new ApiError(400, "Slot ID is required");
    }

    const releasedSlot = await slotService.releaseSlot(slotId);

    return res
      .status(200)
      .json(new ApiResponse(200, releasedSlot, "Slot released successfully"));
  });

  // Find next available slots
  findNextAvailableSlots = asyncHandler(async (req, res) => {
    // const { doctorId } = req.params;
    const doctorId = req.params.doctorId?.replace(":", "");
    const { numberOfSlots, afterDate } = req.query;

    if (!doctorId) {
      throw new ApiError(400, "Doctor ID is required");
    }

    const availableSlots = await slotService.findNextAvailableSlots({
      doctorId,
      numberOfSlots: parseInt(numberOfSlots) || 5,
      afterDate: afterDate ? new Date(afterDate) : new Date(),
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          availableSlots,
          "Next available slots retrieved successfully"
        )
      );
  });

  // Get doctor's schedule
  getDoctorSchedule = asyncHandler(async (req, res) => {
    // const { doctorId } = req.params;
    const doctorId = req.params.doctorId?.replace(":", "");
    const { startDate, endDate } = req.query;

    if (!doctorId || !startDate || !endDate) {
      throw new ApiError(
        400,
        "Doctor ID, start date, and end date are required"
      );
    }

    const schedule = await slotService.getDoctorSchedule({
      doctorId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, schedule, "Doctor schedule retrieved successfully")
      );
  });

  // Check slot availability
  checkSlotAvailability = asyncHandler(async (req, res) => {
    const { doctorId, date, startTime, endTime } = req.body;

    if (!doctorId || !date || !startTime || !endTime) {
      throw new ApiError(
        400,
        "Doctor ID, date, start time, and end time are required"
      );
    }

    const isAvailable = await slotService.checkSlotAvailability({
      doctorId,
      date: new Date(date),
      startTime,
      endTime,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isAvailable },
          "Slot availability checked successfully"
        )
      );
  });

  // Bulk create slots
  bulkCreateSlots = asyncHandler(async (req, res) => {
    const { doctorId, startDate, endDate, timeSlots } = req.body;

    if (
      !doctorId ||
      !startDate ||
      !endDate ||
      !timeSlots ||
      !timeSlots.length
    ) {
      throw new ApiError(
        400,
        "Doctor ID, start date, end date, and time slots are required"
      );
    }

    // Validate time slots format
    timeSlots.forEach((slot) => {
      if (!slot.startTime || !slot.endTime) {
        throw new ApiError(
          400,
          "Each time slot must have startTime and endTime"
        );
      }
    });

    const createdSlots = await slotService.bulkCreateSlots({
      doctorId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      timeSlots,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, createdSlots, "Slots created in bulk successfully")
      );
  });

  // Delete expired slots
  deleteExpiredSlots = asyncHandler(async (req, res) => {
    const { beforeDate } = req.query;

    let newDate;
    if (!beforeDate) {
      newDate = new Date();
    }

    const result = await slotService.deleteExpiredSlots(new Date(beforeDate ? beforeDate : newDate));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          `${result.deletedCount} expired slots deleted successfully`
        )
      );
  });
}

// export default new SlotController();
const slotController = new SlotController();
export default slotController;
