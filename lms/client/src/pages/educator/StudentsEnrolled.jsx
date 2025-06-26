import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentsEnrolled = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data to show when no enrollments exist
  const exampleStudents = [
    { id: 'ex1', name: 'Alice Johnson', email: 'alice@example.com', course: 'React for Beginners', enrollmentDate: '2023-01-15' },
    { id: 'ex2', name: 'Bob Williams', email: 'bob@example.com', course: 'Advanced JavaScript', enrollmentDate: '2023-02-20' },
  ];

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/enrollments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const formatted = res.data.map(enrollment => ({
          id: enrollment._id,
          name: enrollment.student.name,
          email: enrollment.student.email,
          course: enrollment.course.title,
          enrollmentDate: new Date(enrollment.enrolledAt).toISOString().split('T')[0]
        }));

        setStudents(formatted);
      } catch (err) {
        console.error('Failed to fetch enrollments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const displayedStudents = students.length > 0 ? students : exampleStudents;

  return (
    <div className="flex flex-col flex-grow min-h-[calc(100vh-8rem)]">
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold mb-6">Students Enrolled</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                    Course Enrolled
                  </th>
                  <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                    Enrollment Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-5 py-5 border-b bg-white text-sm">
                      <p className="text-gray-900">{student.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b bg-white text-sm">
                      <p className="text-gray-900">{student.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b bg-white text-sm">
                      <p className="text-gray-900">{student.course}</p>
                    </td>
                    <td className="px-5 py-5 border-b bg-white text-sm">
                      <p className="text-gray-900">{student.enrollmentDate}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsEnrolled;
