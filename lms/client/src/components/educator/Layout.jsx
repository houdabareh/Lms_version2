import React, { useContext } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import EducatorNavbar from './EducatorNavbar';
import EducatorFooter from './EducatorFooter';
import { ThemeContext } from '../../context/ThemeContext';
import {
  HomeIcon, PlusIcon, AcademicCapIcon, UsersIcon,
  CalendarDaysIcon, ChartBarIcon, ChatBubbleLeftRightIcon,
  LifebuoyIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Layout = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/educator/dashboard', icon: HomeIcon },
    { name: 'Add Course', href: '/educator/add-course', icon: PlusIcon },
    { name: 'My Courses', href: '/educator/my-courses', icon: AcademicCapIcon },
    { name: 'Students Enrolled', href: '/educator/students', icon: UsersIcon },
    { name: 'Schedule', href: '/educator/schedule', icon: CalendarDaysIcon },
    { name: 'Analytics', href: '/educator/analytics', icon: ChartBarIcon },
    { name: 'Messages', href: '/educator/messages', icon: ChatBubbleLeftRightIcon },
  ];

  const bottomNav = [
    { name: 'Support', href: '/educator/support', icon: LifebuoyIcon },
    { name: 'Settings', href: '/educator/settings', icon: Cog6ToothIcon },
    { name: 'Logout', href: '/logout', icon: ArrowLeftOnRectangleIcon },
  ];

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark bg-darkBg' : 'bg-gray-50'}`}>
      {/* Fixed Sidebar */}
      <aside className="w-64 fixed top-16 left-0 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        <div className="h-full flex flex-col justify-between p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t pt-4 space-y-2">
            {bottomNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64 flex flex-col w-full">
        {/* Navbar */}
        <EducatorNavbar />

        {/* Main content and footer within one scrollable unit */}
        <main className="flex-grow px-6 pt-24 pb-10">
          <Outlet />
        </main>
        <EducatorFooter />
      </div>
    </div>
  );
};

export default Layout;
