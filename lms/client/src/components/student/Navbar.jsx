import React, { useState, useEffect, useContext, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Import NavLink
import { assets } from '../../assets/assets'; // Import assets
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { FaUserCircle } from 'react-icons/fa'; // Import FaUserCircle

const Navbar = () => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  console.log("Student Navbar user:", user);
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // New state for profile dropdown
  const [hasScrolled, setHasScrolled] = useState(false); // State for scroll shadow
  const profileDropdownRef = useRef(null); // Ref for the profile dropdown container

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    const handleOutsideClick = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleOutsideClick); // Add event listener for outside clicks

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleOutsideClick); // Clean up event listener
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md p-4 transition-all duration-300 ease-in-out ${hasScrolled ? 'shadow-lg' : 'shadow-sm'}`}> {/* Updated background and dynamic shadow */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold transform transition-transform duration-300 hover:scale-105">
          <Link to="/student/dashboard">
            <img src={assets.logo} alt="LMS Logo" className="h-8" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-dark focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold transition-colors duration-300' : 'text-dark hover:text-primary transition-colors duration-300'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/student/course-list"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold transition-colors duration-300' : 'text-dark hover:text-primary transition-colors duration-300'
            }
          >
            Courses
          </NavLink>
          <NavLink
            to="/student/my-enrollments"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold transition-colors duration-300' : 'text-dark hover:text-primary transition-colors duration-300'
            }
          >
            My Enrollments
          </NavLink>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className="text-dark hover:text-primary focus:outline-none flex items-center transition-colors duration-300"
            >
              Tools
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {isToolsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <NavLink
                  to="/student/live-sessions"
                  className={({ isActive }) =>
                    `block px-4 py-2 ${isActive ? 'text-primary font-bold' : 'text-gray-800 hover:bg-gray-100'} transition-colors duration-300`
                  }
                  onClick={() => { setIsToolsDropdownOpen(false); setIsOpen(false); }}
                >
                  Live Sessions
                </NavLink>
                <NavLink
                  to="/student/calendar"
                  className={({ isActive }) =>
                    `block px-4 py-2 ${isActive ? 'text-primary font-bold' : 'text-gray-800 hover:bg-gray-100'} transition-colors duration-300`
                  }
                  onClick={() => { setIsToolsDropdownOpen(false); setIsOpen(false); }}
                >
                  Calendar
                </NavLink>
                <NavLink
                  to="/student/discussion"
                  className={({ isActive }) =>
                    `block px-4 py-2 ${isActive ? 'text-primary font-bold' : 'text-gray-800 hover:bg-gray-100'} transition-colors duration-300`
                  }
                  onClick={() => { setIsToolsDropdownOpen(false); setIsOpen(false); }}
                >
                  Discussion
                </NavLink>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative" ref={profileDropdownRef}> {/* Add ref here */}
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} // Toggle dropdown
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FaUserCircle className="text-3xl text-gray-700 dark:text-white" />
                <span className="hidden md:inline font-medium">{user.name?.split(' ')[0]}</span>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-md py-1 z-20"> {/* No more group-hover */}
                  <Link to="/student/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsProfileDropdownOpen(false)}>View Profile</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.href = '/login';
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold transition-colors duration-300' : 'text-dark hover:text-primary transition-colors duration-300'
              }
            >
              Login/Profile
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile menu expanded */}
      {isOpen && (
        <div className="md:hidden bg-white mt-2 shadow-md">
          <NavLink to="/student/dashboard" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-primary font-bold' : 'text-dark hover:bg-gray-100'} transition-colors duration-300`} onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/student/course-list" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-primary font-bold' : 'text-dark hover:bg-gray-100'} transition-colors duration-300`} onClick={() => setIsOpen(false)}>Courses</NavLink>
          <NavLink to="/student/my-enrollments" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-primary font-bold' : 'text-dark hover:bg-gray-100'} transition-colors duration-300`} onClick={() => setIsOpen(false)}>My Enrollments</NavLink>

          {/* Mobile Tools Dropdown */}
          <button
            onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
            className="block text-dark px-4 py-2 hover:bg-gray-100 w-full text-left flex items-center justify-between transition-colors duration-300"
          >
            Tools
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {isToolsDropdownOpen && (
            <div className="bg-gray-50 py-1">
              <NavLink
                to="/student/calendar"
                className={({ isActive }) => `block px-8 py-2 ${isActive ? 'text-primary font-bold' : 'text-gray-800 hover:bg-gray-100'} transition-colors duration-300`}
                onClick={() => { setIsToolsDropdownOpen(false); setIsOpen(false); }}
              >
                Calendar
              </NavLink>
              <NavLink
                to="/student/live-sessions"
                className={({ isActive }) => `block px-8 py-2 ${isActive ? 'text-primary font-bold' : 'text-gray-800 hover:bg-gray-100'} transition-colors duration-300`}
                onClick={() => { setIsToolsDropdownOpen(false); setIsOpen(false); }}
              >
                Live Sessions
              </NavLink>
              <NavLink
                to="/student/discussion"
                className={({ isActive }) => `block px-8 py-2 ${isActive ? 'text-primary font-bold' : 'text-gray-800 hover:bg-gray-100'} transition-colors duration-300`}
                onClick={() => { setIsToolsDropdownOpen(false); setIsOpen(false); }}
              >
                Discussion
              </NavLink>
            </div>
          )}
          {user ? (
            <div className="relative group"> {/* Keep group for mobile or adjust as needed for mobile profile dropdown */}
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} // Toggle dropdown
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FaUserCircle className="text-3xl text-gray-700 dark:text-white" />
                <span className="inline font-medium">{user.name?.split(' ')[0]}</span>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-md rounded-md z-50"> {/* No more hidden group-hover:block */}
                  <Link to="/student/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsProfileDropdownOpen(false)}>View Profile</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.href = '/login';
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-primary font-bold' : 'text-dark hover:bg-gray-100'} transition-colors duration-300`} onClick={() => setIsOpen(false)}>Login/Profile</NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;