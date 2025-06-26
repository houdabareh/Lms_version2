import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function AnimatedTable({ courses = [] }) {
  return (
    <div className="overflow-x-auto bg-white/30 rounded-3xl shadow-2xl p-6 glass-table">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-blue-400 to-yellow-300 text-white">
            <th className="px-4 py-3 rounded-tl-2xl">Image</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Educator</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 rounded-tr-2xl">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(courses.length ? courses : [1,2,3]).map((course, idx) => (
            <tr key={idx} className="animate-fadeIn bg-white/40 hover:bg-blue-50 transition">
              <td className="px-4 py-3">
                <img src={course?.image || '/assets/course_1.png'} alt="Course" className="w-12 h-12 rounded-xl shadow" />
              </td>
              <td className="px-4 py-3 font-semibold text-blue-900">{course?.title || "Course Title"}</td>
              <td className="px-4 py-3 text-blue-700">{course?.educator || "Educator"}</td>
              <td className="px-4 py-3 text-blue-500">{course?.date || "2024-01-01"}</td>
              <td className="px-4 py-3">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-yellow-300 text-white text-xs font-bold shadow">{course?.status || "Pending"}</span>
              </td>
              <td className="px-4 py-3 flex gap-2">
                <button className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-400 to-yellow-300 text-white shadow hover:scale-105 transition flex items-center gap-1">
                  <FaCheck /> Approve
                </button>
                <button className="px-3 py-1 rounded-xl bg-gradient-to-r from-red-400 to-yellow-300 text-white shadow hover:scale-105 transition flex items-center gap-1">
                  <FaTimes /> Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .glass-table {
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18), 0 2px 8px 0 rgba(251,191,36,0.12);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s cubic-bezier(.39,.575,.565,1) both;
        }
      `}</style>
    </div>
  );
}
