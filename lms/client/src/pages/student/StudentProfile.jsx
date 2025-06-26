import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';
import { FaUserGraduate, FaUserCircle, FaEnvelope, FaIdCard } from 'react-icons/fa';

const StudentProfile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-red-500">User not logged in.</div>;
  }

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
          <div className="flex flex-col items-center mb-6">
            <FaUserCircle className="text-indigo-600 text-6xl mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-md text-gray-600">{user.role === 'student' ? 'Student' : 'Unknown Role'}</p>
          </div>

          <div className="border-t border-gray-200 pt-6 text-left">
            <div className="mb-4">
              <p className="text-gray-700 font-semibold flex items-center">
                <FaEnvelope className="mr-2 text-indigo-500" /> Email:
              </p>
              <p className="text-gray-800 ml-6">{user.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-semibold flex items-center">
                <FaIdCard className="mr-2 text-indigo-500" /> User ID:
              </p>
              <p className="text-gray-800 ml-6 break-all">{user._id}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-semibold flex items-center">
                <FaUserGraduate className="mr-2 text-indigo-500" /> Role:
              </p>
              <p className="text-gray-800 ml-6 capitalize">{user.role}</p>
            </div>
            {/* Add more user-specific details here as needed */}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile; 