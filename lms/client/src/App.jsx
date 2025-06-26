import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Student Pages
import Home from './pages/student/Home';
import CoursesList from './pages/student/CoursesList';
import CourseDetails from './pages/student/CourseDetails';
import MyEnrollments from './pages/student/MyEnrollments';
import Player from './pages/student/Player';
import CoursePlayer from './pages/student/CoursePlayer';
import TaskPage from './pages/student/TaskPage';
import StudentProfile from './pages/student/StudentProfile';
import Checkout from './pages/student/Checkout';

// Student Tools Pages
import LiveSessions from './pages/student/tools/LiveSessions';
import Calendar from './pages/student/tools/Calendar';
import ChatDashboard from './pages/student/tools/ChatDashboard';

// Educator Tools Pages
import EducatorChatDashboard from './pages/educator/ChatDashboard';

// Educator Pages
import Educator from './pages/educator/Educator'; // Assuming this exists as a layout component
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import Schedule from './pages/educator/Schedule';
import Messages from './pages/educator/Messages';
import Support from './pages/educator/Support';
import Settings from './pages/educator/Settings';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';

// General Pages (Login, Signup, Forgot Password)
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

// New Homepage and Courses Page
import Homepage from './pages/Homepage';
import Courses from './pages/Courses';
import CourseDetailsPage from './pages/CourseDetailsPage';
import AboutUs from './pages/AboutUs';

// Layout Components
import Loading from './components/student/Loading'; // Can be used generally
import StudentLayout from './components/student/StudentLayout'; // Confirmed in previous search results
import RoleBasedMessageRedirect from './components/RoleBasedMessageRedirect';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import PendingCourses from './pages/admin/PendingCourses';
import ManageUsers from './pages/admin/ManageUsers';
import CourseReview from './pages/admin/CourseReview';
import Analytics from './pages/admin/Analytics';
import CourseDetailsAdmin from './pages/admin/CourseDetailsAdmin';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Accessible to all */}
          <Route path="/" element={<Homepage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/support" element={<Support />} /> {/* Using Educator Support as a placeholder public support page */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Role-based Messages Redirect */}
          <Route path="/messages" element={<RoleBasedMessageRedirect />} />
          {/* Temporary public checkout route for testing */}
          <Route path="/checkout/:courseId" element={<Checkout />} />
          {/* Temporary public course player route for testing */}
          <Route path="/course-player/:courseId" element={<CoursePlayer />} />
          <Route path="/course-player/:courseId/:moduleId/:lessonId" element={<CoursePlayer />} />
          {/* Temporary public task page route for testing */}
          <Route path="/task/:courseId/:taskId" element={<TaskPage />} />
          {/* New navigation routes */}
          <Route path="/course/:courseId/task/:taskId" element={<TaskPage />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<CoursePlayer />} />

          {/* Student Routes - Nested under StudentLayout and ProtectedRoute */}
          <Route 
            path="/student/*"
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} /> {/* Default student route */}
            <Route path="dashboard" element={<Home />} />
            <Route path="course-list" element={<CoursesList />} />
            <Route path="courses/:courseId" element={<Player />} /> {/* Course preview page */}
            <Route path="course/:id" element={<CourseDetails />} />
            <Route path="my-enrollments" element={<MyEnrollments />} />
            <Route path="player/:id" element={<Player />} />
            <Route path="course-player/:courseId" element={<CoursePlayer />} />
            <Route path="course-player/:courseId/:moduleId/:lessonId" element={<CoursePlayer />} />
            <Route path="task/:courseId/:taskId" element={<TaskPage />} />
            {/* New navigation routes for students */}
            <Route path="course/:courseId/task/:taskId" element={<TaskPage />} />
            <Route path="course/:courseId/lesson/:lessonId" element={<CoursePlayer />} />
            <Route path="live-sessions" element={<LiveSessions />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="messages" element={<ChatDashboard />} />
            <Route path="discussion" element={<ChatDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="checkout/:courseId" element={<Checkout />} />
            {/* QuizList, QuizPage, and Gradebook routes are removed as the files do not exist */}
          </Route>

          {/* Educator Routes - Nested under Educator layout and ProtectedRoute */}
          <Route
            path="/educator/*"
            element={
              <ProtectedRoute role="educator">
                <Educator />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} /> {/* Default educator route */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="my-courses" element={<MyCourses />} />
            {/* Students route removed as the file does not exist */}
            <Route path="schedule" element={<Schedule />} />
            <Route path="messages" element={<Messages />} />
            <Route path="chat" element={<EducatorChatDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<Support />} />
            <Route path="students" element={<StudentsEnrolled />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="pending-courses" element={<PendingCourses />} />
                <Route path="courses/:id" element={<CourseDetailsAdmin />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="course-review" element={<CourseReview />} />
                <Route path="analytics" element={<Analytics />} />
              </Routes>
            }
          />
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;