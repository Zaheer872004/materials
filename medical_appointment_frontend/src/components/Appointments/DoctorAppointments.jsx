// src/components/Appointments/DoctorAppointments.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorAppointments } from '../../service/apiCalling';

function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get doctorId from localStorage or user context
  const doctorId = localStorage.getItem('doctorId');

  useEffect(() => {
    if (!doctorId) {
      setError('Doctor ID not found. Please log in again.');
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getDoctorAppointments(doctorId, selectedDate);
        setAppointments(response.data || []);
      } catch (error) {
        setError(error.message || 'Failed to fetch appointments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId, selectedDate]);

  if (!doctorId) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>Doctor ID not found. Please log in again.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctor's Appointments</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No appointments found for this date.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    Time: {appointment.startTime} - {appointment.endTime}
                  </p>
                  <p className="text-gray-600">Patient: {appointment.patientName}</p>
                  <p className="text-gray-600">Status: {appointment.status}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => navigate(`/appointments/${appointment._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/appointments/${appointment._id}/reschedule`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;