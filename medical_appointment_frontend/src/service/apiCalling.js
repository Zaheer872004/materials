// src/service/apiCalling.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
// /api/slots/book

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);


// Appointment related exports
export const getAppointmentDetails = async (appointmentId) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createAppointment = async (data) => {
  try {
    const response = await api.post('/appointments/create', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkAvailability = async (data) => {
  try {
    const response = await api.post('/appointments/availability', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDoctorAppointments = async (doctorId, date) => {
  if (!doctorId) {
    throw new Error('Doctor ID is required');
  }

  try {
    const response = await api.get(`/appointments/doctor/${doctorId}`, {
      params: { date }
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
  }
};

export const rescheduleAppointment = async (appointmentId, data) => {
  try {
    const response = await api.patch(`/appointments/${appointmentId}/reschedule`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const cancelAppointment = async (appointmentId, reason) => {
  try {
    const response = await api.delete(`/appointments/${appointmentId}`, {
      data: { reason }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markAsNoShow = async (appointmentId) => {
  try {
    const response = await api.patch(`/appointments/${appointmentId}/no-show`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Slot related exports
export const createDoctorSlots = async (data) => {
  try {
    const response = await api.post('/slots/create', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const bulkCreateSlots = async (data) => {
  try {
    const response = await api.post('/slots/bulk-create', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const findAvailableSlots = async (doctorId, startDate, endDate) => {
  try {
    const response = await api.get(`/slots/available/${doctorId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const bookSlot = async (data) => {
  try {
    const response = await api.post('/slots/book', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const releaseSlot = async (slotId) => {
  try {
    const response = await api.patch(`/slots/release/${slotId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const findNextAvailableSlots = async (doctorId, numberOfSlots, afterDate) => {
  try {
    const response = await api.get(`/slots/next-available/${doctorId}`, {
      params: { numberOfSlots, afterDate }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDoctorSchedule = async (doctorId, startDate, endDate) => {
  try {
    const response = await api.get(`/slots/schedule/${doctorId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkSlotAvailability = async (data) => {
  try {
    const response = await api.post('/slots/check-availability', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteExpiredSlots = async (beforeDate) => {
  try {
    const response = await api.delete('/slots/expired', {
      params: { beforeDate }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Error handling utility
export const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || 'Something went wrong';
  console.error('API Error:', errorMessage);
  return errorMessage;
};

// Date formatting utility
export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Time formatting utility
export const formatTime = (time) => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export default api;