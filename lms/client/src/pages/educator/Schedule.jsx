// This is a test comment to check file editability.
// This is a test comment to force re-transpilation.
import React, { useState, useEffect, useContext } from 'react';
import {
  PlusIcon,
} from '@heroicons/react/24/outline';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import the new EducatorCalendar component
import EducatorCalendar from '../../components/educator/EducatorCalendar';

const Schedule = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false); // State to control EducatorCalendar's modal

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-darkBg' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-6 px-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Schedule</h1>
        <button
          onClick={() => {
            setIsCalendarModalOpen(true); // Open the calendar's internal modal
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Event
        </button>
      </div>

      <div className="flex-grow px-6 pb-6">
        <div>
          <EducatorCalendar
            isModalOpen={isCalendarModalOpen}
            setIsModalOpen={setIsCalendarModalOpen}
          />
        </div>
      </div>
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </footer>
    </div>
  );
};

export default Schedule; 