import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";
import transport from "../config/mailer.js";
import transporter from "../config/mailer.js";
import dotenv from "dotenv";
dotenv.config();

class NotificationService {
  constructor() {
    // Initialize email transporter
    this.emailTransporter = transporter
  }

  /**
   * Helper method to format date and time
   * @param {Date} date
   * @param {String} time
   * @returns {String}
   */
  formatDateTime(date, time) {
    return `${new Date(date).toLocaleDateString()} at ${time}`;
  }

  /**
   * Helper method to get patient and doctor details
   * @param {String} patientId
   * @param {String} doctorId
   * @returns {Promise<{patient: Object, doctor: Object}>}
   */
  async getAppointmentParticipants(patientId, doctorId) {
    try {
      const [patient, doctor] = await Promise.all([
        Patient.findById(patientId),
        Doctor.findById(doctorId),
      ]);

      if (!patient || !doctor) {
        throw new ApiError(404, "Patient or Doctor not found");
      }

      return { patient, doctor };
    } catch (error) {
      console.error("Error fetching participants:", error);
      throw new ApiError(500, "Failed to fetch appointment participants");
    }
  }

  /**
   * Send email helper method
   * @param {Object} emailDetails
   * @returns {Promise}
   */
  async sendEmail(emailDetails) {
    try {
      const info = await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emailDetails.to,
        subject: emailDetails.subject,
        html: emailDetails.html,
      });
      console.log("Email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new ApiError(500, "Failed to send email notification");
    }
  }

  /**
   * Send confirmation notification
   * @param {Object} appointment - Appointment details
   */
  async sendAppointmentConfirmation(appointment) {
    try {
      const { patientId, doctorId, date, startTime, endTime } = appointment;
      const { patient, doctor } = await this.getAppointmentParticipants(
        patientId,
        doctorId
      );

      const emailContent = {
        to: patient.email,
        subject: "Appointment Confirmation",
        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #333;">Appointment Confirmation</h2>
                  <p>Dear ${patient.name},</p>
                  <p>Your appointment has been successfully scheduled.</p>
                  
                  <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
                      <h3 style="color: #444; margin-top: 0;">Appointment Details:</h3>
                      <p><strong>Date:</strong> ${new Date(
                        date
                      ).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
                      <p><strong>Doctor:</strong> ${doctor.name}</p>
                      <p><strong>Specialization:</strong> ${
                        doctor.specialization
                      }</p>
                  </div>

                  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                      <h3 style="color: #444; margin-top: 0;">Important Information:</h3>
                      <ul style="list-style: none; padding-left: 0;">
                          <li>✓ Please arrive 10 minutes before your scheduled time</li>
                          <li>✓ Bring any relevant medical records or test results</li>
                          <li>✓ If you need to cancel or reschedule, please do so at least 24 hours in advance</li>
                      </ul>
                  </div>
                  
                  <div style="margin-top: 20px; color: #666;">
                      <p>Best regards,<br>Medical Appointment Team</p>
                  </div>
              </div>
          `,
      };

      await this.sendEmail(emailContent);
      return true;
    } catch (error) {
      console.error("Error sending appointment confirmation:", error);
      throw new ApiError(500, "Failed to send appointment confirmation");
    }
  }

  /**
   * Send no-show notification with rescheduling options
   * @param {Object} appointment - Missed appointment details
   * @param {Array} availableSlots - Available slots for rescheduling
   */
  async sendNoShowNotification(appointment, availableSlots) {
    try {
      const { patientId, doctorId, date, startTime } = appointment;
      const { patient, doctor } = await this.getAppointmentParticipants(
        patientId,
        doctorId
      );

      const slotsHTML = availableSlots
        .map(
          (slot) => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        ${this.formatDateTime(slot.date, slot.startTime)}
                    </td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <a href="${process.env.APP_URL}/reschedule/${
            appointment._id
          }/${slot._id}"
                           style="background-color: #4CAF50; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px;">
                            Book This Slot
                        </a>
                    </td>
                </tr>
            `
        )
        .join("");

      const emailContent = {
        to: patient.email,
        subject: "Missed Appointment - Rescheduling Options Available",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Missed Appointment Notice</h2>
                        <p>Dear ${patient.firstName},</p>
                        <p>We noticed you missed your appointment with Dr. ${
                          doctor.name
                        } scheduled for ${this.formatDateTime(
          date,
          startTime
        )}.</p>
                        
                        <h3 style="color: #444;">Available Rescheduling Slots:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <thead>
                                <tr>
                                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f5f5f5;">Available Time</th>
                                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f5f5f5;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${slotsHTML}
                            </tbody>
                        </table>
                        
                        <p style="margin-top: 20px;">Please reschedule your appointment at your earliest convenience.</p>
                        <p>If you need assistance, please contact us at ${
                          process.env.SUPPORT_EMAIL
                        }</p>
                    </div>
                `,
      };

      await this.sendEmail(emailContent);
    } catch (error) {
      console.error("Error in sendNoShowNotification:", error);
      throw new ApiError(500, "Failed to send no-show notification");
    }
  }

  /**
   * Send rescheduling confirmation
   * @param {Object} params
   * @param {Object} params.appointment - New appointment
   * @param {Object} params.oldAppointment - Original appointment
   */
  async sendRescheduleConfirmation({ appointment, oldAppointment }) {
    try {
      const { patientId, doctorId, date, startTime, endTime } = appointment;
      const { patient, doctor } = await this.getAppointmentParticipants(
        patientId,
        doctorId
      );

      const emailContent = {
        to: patient.email,
        subject: "Appointment Successfully Rescheduled",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Appointment Rescheduled Successfully</h2>
                        <p>Dear ${patient.firstName},</p>
                        <p>Your appointment has been successfully rescheduled.</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #444; margin-top: 0;">New Appointment Details:</h3>
                            <p style="margin: 5px 0;">Date: ${this.formatDateTime(
                              date,
                              startTime
                            )}</p>
                            <p style="margin: 5px 0;">Doctor: Dr. ${
                              doctor.name
                            }</p>
                            <p style="margin: 5px 0;">Duration: ${startTime} - ${endTime}</p>
                            <p style="margin: 5px 0;">Location: ${
                              doctor.clinic
                            }</p>
                        </div>

                        <p style="color: #666;">Previous appointment was scheduled for: ${this.formatDateTime(
                          oldAppointment.date,
                          oldAppointment.startTime
                        )}</p>
                        
                        <p style="margin-top: 20px;">
                            <strong>Important:</strong> Please arrive 10 minutes before your appointment time.
                        </p>
                        
                        <p style="color: #888; font-size: 0.9em;">
                            Need to make changes? Please contact us at ${
                              process.env.SUPPORT_EMAIL
                            }
                        </p>
                    </div>
                `,
      };

      await this.sendEmail(emailContent);
    } catch (error) {
      console.error("Error in sendRescheduleConfirmation:", error);
      throw new ApiError(500, "Failed to send reschedule confirmation");
    }
  }

  /**
   * Send cancellation notification
   * @param {Object} appointment - Appointment details
   * @param {String} reason - Cancellation reason
   */
  async sendCancellationNotification(appointment, reason) {
    try {
      const { patientId, doctorId, date, startTime } = appointment;
      const { patient, doctor } = await this.getAppointmentParticipants(
        patientId,
        doctorId
      );

      const emailContent = {
        to: patient.email,
        subject: "Appointment Cancellation Notice",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Appointment Cancellation Notice</h2>
                        <p>Dear ${patient.firstName},</p>
                        
                        <div style="background-color: #fff3f3; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p>Your appointment has been cancelled:</p>
                            <ul style="list-style: none; padding-left: 0;">
                                <li>Date: ${this.formatDateTime(
                                  date,
                                  startTime
                                )}</li>
                                <li>Doctor: Dr. ${doctor.name}</li>
                                <li>Reason: ${reason}</li>
                            </ul>
                        </div>

                        <p>To schedule a new appointment, please:</p>
                        <ol>
                            <li>Visit our website: ${process.env.APP_URL}</li>
                            <li>Log into your account</li>
                            <li>Select "Book New Appointment"</li>
                        </ol>

                        <p style="color: #666;">
                            If you have any questions, please contact us at ${
                              process.env.SUPPORT_EMAIL
                            }
                        </p>
                    </div>
                `,
      };

      await this.sendEmail(emailContent);
    } catch (error) {
      console.error("Error in sendCancellationNotification:", error);
      throw new ApiError(500, "Failed to send cancellation notification");
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
