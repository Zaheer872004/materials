// src/components/Layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// SidebarLink component
const SidebarLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          isActive
            ? 'bg-indigo-50 text-indigo-600'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span className="text-xl">{icon}</span>
        <span>{children}</span>
      </Link>
    </li>
  );
};

// Main Sidebar component
const Sidebar = ({ isOpen }) => {
  return (
    <aside 
      className={`fixed left-0 top-16 h-full w-64 bg-white shadow-md transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="p-4">
        <ul className="space-y-2">
          <SidebarLink to="/dashboard" icon="📊">
            Dashboard
          </SidebarLink>
          <SidebarLink to="/appointments" icon="📅">
            Appointments
          </SidebarLink>
          <SidebarLink to="/appointments/create" icon="➕">
            Create Appointment
          </SidebarLink>
          <SidebarLink to="/slots" icon="⏰">
            Manage Slots
          </SidebarLink>
          <SidebarLink to="/slots/schedule" icon="📋">
            Doctor Schedule
          </SidebarLink>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;