// routes/appointment.routes.js

import { Router } from 'express';
import appointmentController from '../controllers/appointment.controller.js';
// import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// JWT Authentication required for all routes but currently not implemented
// router.use(verifyJWT);

/**
 * @route POST /api/v1/appointments/create
 * @description Create a new appointment
 * @body {
 *   doctorId: string,
 *   patientId: string,
 *   date: string (YYYY-MM-DD),
 *   startTime: string (HH:mm),
 *   endTime: string (HH:mm)
 * }
 */
router.post('/create', appointmentController.createAppointment);

/**
 * @route POST /api/v1/appointments/availability
 * @description Check appointment slot availability
 * @body {
 *   doctorId: string,
 *   date: string (YYYY-MM-DD),
 *   startTime: string (HH:mm),
 *   endTime: string (HH:mm)
 * }
 */
router.post('/availability', appointmentController.checkAvailability);

/**
 * @route GET /api/v1/appointments/doctor/:doctorId
 * @description Get all appointments for a doctor on a specific date
 * @params doctorId - Doctor's ID
 * @query date - Date to fetch appointments for (YYYY-MM-DD)
 */
router.get('/doctor/:doctorId', appointmentController.getDoctorAppointments);

/**
 * @route PATCH /api/v1/appointments/:appointmentId/reschedule
 * @description Reschedule an existing appointment
 * @params appointmentId - Appointment ID to reschedule
 * @body {
 *   newSlot: {
 *     date: string (YYYY-MM-DD),
 *     startTime: string (HH:mm),
 *     endTime: string (HH:mm)
 *   }
 * }
 */
router.patch('/:appointmentId/reschedule', appointmentController.rescheduleAppointment);

/**
 * @route DELETE /api/v1/appointments/:appointmentId
 * @description Cancel an appointment
 * @params appointmentId - Appointment ID to cancel
 * @body {
 *   reason: string
 * }
 */
router.delete('/:appointmentId', appointmentController.cancelAppointment);

/**
 * @route PATCH /api/v1/appointments/:appointmentId/no-show
 * @description Mark an appointment as no-show
 * @params appointmentId - Appointment ID to mark as no-show
 */
router.patch('/:appointmentId/no-show', appointmentController.markAsNoShow);

export default router;