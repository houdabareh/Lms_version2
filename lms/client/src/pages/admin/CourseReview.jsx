import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import NotificationBell from '../../components/admin/NotificationBell';
import CourseReviewModal from '../../components/admin/CourseReviewModal';

const sampleCourse = {
  educator: 'Jane Doe',
  lessons: [1, 2, 3],
};

export default function CourseReview() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-50">
      <AdminSidebar active="Courses" />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex items-center justify-between px-8 pt-8">
          <AdminNavbar />
          <NotificationBell />
        </div>
        <div className="flex flex-col items-center justify-start p-10 flex-1 w-full">
          <CourseReviewModal open={true} course={sampleCourse} onClose={() => {}} />
        </div>
      </div>
    </div>
  );
}
