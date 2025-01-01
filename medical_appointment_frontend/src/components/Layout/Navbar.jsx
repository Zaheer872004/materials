// src/components/Layout/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
          <Link to="/" className="text-xl font-semibold text-gray-800">
            Medical Appointments
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-4">
            <Link 
              to="/appointments" 
              className="px-3 py-2 rounded-md text-sm hover:bg-gray-100"
            >
              Appointments
            </Link>
            <Link 
              to="/slots" 
              className="px-3 py-2 rounded-md text-sm hover:bg-gray-100"
            >
              Slots
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;