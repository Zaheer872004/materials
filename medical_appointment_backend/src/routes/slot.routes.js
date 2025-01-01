// routes/slot.routes.js

import {Router} from 'express';
import slotController from '../controllers/slot.controller.js';
// import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// JWT Authentication required for all routes but currently not implemented
// router.use(verifyJWT);

/**
 * @route POST /api/v1/slots/create
 * @description Create new slots for a doctor
 * @body {
 *   doctorId: string,
 *   date: string (YYYY-MM-DD),
 *   timeSlots: Array<{
 *     startTime: string (HH:mm),
 *     endTime: string (HH:mm)
 *   }>
 * }
 * @access Private
 */
router.post('/create', slotController.createDoctorSlots);

/**
 * @route GET /api/v1/slots/available/:doctorId
 * @description Get all available slots for a specific doctor
 * @params doctorId - Doctor's ID
 * @query {
 *   startDate: string (YYYY-MM-DD),
 *   endDate: string (YYYY-MM-DD)
 * }
 * @access Public
 */
router.get('/available/:doctorId', slotController.findAvailableSlots);

/**
 * @route POST /api/v1/slots/book
 * @description Book a specific slot
 * @body {
 *   slotId: string,
 *   appointmentId: string
 * }
 * @access Private
 */
router.post('/book', slotController.bookSlot);

/**
 * @route PATCH /api/v1/slots/release/:slotId
 * @description Release a booked slot
 * @params slotId - Slot ID to release
 * @access Private
 */
router.patch('/release/:slotId', slotController.releaseSlot);

/**
 * @route GET /api/v1/slots/next-available/:doctorId
 * @description Get next available slots for a doctor
 * @params doctorId - Doctor's ID
 * @query {
 *   numberOfSlots: number,
 *   afterDate: string (YYYY-MM-DD)
 * }
 * @access Public
 */
router.get('/next-available/:doctorId', slotController.findNextAvailableSlots);

/**
 * @route GET /api/v1/slots/schedule/:doctorId
 * @description Get doctor's complete schedule
 * @params doctorId - Doctor's ID
 * @query {
 *   startDate: string (YYYY-MM-DD),
 *   endDate: string (YYYY-MM-DD)
 * }
 * @access Private
 */
router.get('/schedule/:doctorId', slotController.getDoctorSchedule);

/**
 * @route POST /api/v1/slots/check-availability
 * @description Check if a specific slot is available
 * @body {
 *   doctorId: string,
 *   date: string (YYYY-MM-DD),
 *   startTime: string (HH:mm),
 *   endTime: string (HH:mm)
 * }
 * @access Public
 */
router.post('/check-availability', slotController.checkSlotAvailability);

/**
 * @route POST /api/v1/slots/bulk-create
 * @description Create multiple slots for multiple days
 * @body {
 *   doctorId: string,
 *   startDate: string (YYYY-MM-DD),
 *   endDate: string (YYYY-MM-DD),
 *   timeSlots: Array<{
 *     startTime: string (HH:mm),
 *     endTime: string (HH:mm)
 *   }>
 * }
 * @access Private
 */
router.post('/bulk-create', slotController.bulkCreateSlots);

/**
 * @route DELETE /api/v1/slots/expired
 * @description Delete all expired and unbooked slots
 * @query {
 *   beforeDate: string (YYYY-MM-DD) - Optional, defaults to current date
 * }
 * @access Private
 */
router.delete('/expired', slotController.deleteExpiredSlots);

export default router;