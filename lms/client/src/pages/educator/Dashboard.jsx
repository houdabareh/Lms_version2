import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Heroicons - ensure you have them installed via `npm install @heroicons/react`
import {
  HomeIcon,
  PlusIcon, // for Add Course
  AcademicCapIcon, // for My Courses
  UsersIcon, // for Students Enrolled
  CalendarDaysIcon, // for Schedule
  ChartBarIcon, // for Analytics
  CurrencyDollarIcon, // for Earnings
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            console.error('Failed to fetch user data:', data.message);
            // Optionally, clear token and redirect to login if token is invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // navigate('/login'); // Uncomment if you want to redirect
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoadingUser(false);
        }
      } else {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Dummy data for animated counters and latest enrollments (moved from Layout.jsx)
  const stats = [
    { name: 'Total Enrollments', value: 1250, icon: UsersIcon, color: 'text-primary' },
    { name: 'Total Courses', value: 35, icon: AcademicCapIcon, color: 'text-green-500' },
    { name: 'Total Earnings', value: '$85,000', icon: CurrencyDollarIcon, color: 'text-accent' },
  ];

  const latestEnrollments = [
    { id: 1, studentName: 'Alice Johnson', course: 'Introduction to React', date: '2023-10-26' },
    { id: 2, studentName: 'Bob Williams', course: 'Advanced Python', date: '2023-10-25' },
    { id: 3, studentName: 'Charlie Brown', course: 'Web Development Basics', date: '2023-10-24' },
    { id: 4, studentName: 'Diana Prince', course: 'Data Science with R', date: '2023-10-23' },
  ];

  const upcomingSchedule = [
    { id: 1, title: 'Live Q&A: React Hooks', time: 'Mon, Nov 6, 10:00 AM' },
    { id: 2, title: 'Course Review: Python Project', time: 'Wed, Nov 8, 2:00 PM' },
    { id: 3, title: 'New Course Launch Prep', time: 'Fri, Nov 10, 9:00 AM' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col flex-grow min-h-[calc(100vh-8rem)]">
      <div className="px-6 py-6">
        {/* Welcome Message (Re-introduced here as it's dashboard specific) */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user ? user.name : 'Instructor'}!
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Here's a quick overview of your dashboard.
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((item) => (
            <div key={item.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg transform transition duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-700 min-w-[240px]">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon className={`h-10 w-10 ${item.color}`} aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {item.name}
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {/* Placeholder for animated counter */}
                        {item.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions (Optional) */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 dark:bg-primary dark:hover:bg-indigo-600">
              <PlusIcon className="h-5 w-5 mr-2" /> Create New Course
            </button>
            <button className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
              <ChartBarIcon className="h-5 w-5 mr-2" /> View Reports
            </button>
            {/* Add more quick actions as needed */}
          </div>
        </div>

        {/* Latest Enrollments & Upcoming Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Enrollments */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Latest Enrollments</h2>
            <div className="overflow-x-auto"> {/* Added for table scroll on small screens */}
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {latestEnrollments.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{enrollment.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{enrollment.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{enrollment.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Schedule (Calendar Widget Placeholder) */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming Schedule</h2>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-sm">Calendar widget goes here.</p>
              <ul className="mt-4 space-y-2 text-left">
                {upcomingSchedule.map((event) => (
                  <li key={event.id} className="flex items-center space-x-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      <span className="font-medium">{event.time}:</span> {event.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
