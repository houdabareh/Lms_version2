import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded transition duration-200 ${isActive ? 'bg-gray-700 border-l-4 border-primary' : 'hover:bg-gray-700'}`;

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Educator Panel</h2>
      <nav>
        <ul>
          <li className="mb-3">
            <NavLink to="/educator" className={linkClasses}>
              Dashboard
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink to="/educator/my-courses" className={linkClasses}>
              My Courses
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink to="/educator/add-course" className={linkClasses}>
              Add Course
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink to="/educator/students" className={linkClasses}>
              Students Enrolled
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink to="/educator/schedule" className={linkClasses}>
              Schedule
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink to="/educator/analytics" className={linkClasses}>
              Analytics
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink to="/educator/messages" className={linkClasses}>
              Messages
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink to="/educator/support" className={linkClasses}>
              Support
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink to="/educator/settings" className={linkClasses}>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;