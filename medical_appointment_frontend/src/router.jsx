// src/router.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import ErrorPage from './components/ErrorPage';

// Appointment Components
import AppointmentManagement from './components/Appointments/AppointmentManagement';
import AppointmentCalendar from './components/Appointments/AppointmentCalendar';
import AppointmentDetails from './components/Appointments/AppointmentDetails';
import CreateAppointment from './components/Appointments/CreateAppointment';
import DoctorAppointments from './components/Appointments/DoctorAppointments';
import RescheduleAppointment from './components/Appointments/RescheduleAppointment';
import AppointmentList from './components/Appointments/AppointmentList';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <AppointmentCalendar />,
        loader: async () => {
          // You can add data fetching here if needed
          return null;
        }
      },
      {
        path: 'appointments',
        element: <AppointmentManagement />,
        children: [
          {
            index: true,
            element: <AppointmentList />
          },
          {
            path: 'create',
            element: <CreateAppointment />
          },
          {
            path: ':appointmentId',
            element: <AppointmentDetails />,
            loader: async ({ params }) => {
              return { appointmentId: params.appointmentId };
            }
          },
          {
            path: ':appointmentId/reschedule',
            element: <RescheduleAppointment />,
            loader: async ({ params }) => {
              return { appointmentId: params.appointmentId };
            }
          },
          {
            path: 'doctor/:doctorId',
            element: <DoctorAppointments />,
            loader: async ({ params }) => {
              return { doctorId: params.doctorId };
            }
          }
        ]
      }
    ]
  }
]);