import React from "react";
import { FaCheckCircle, FaTimesCircle, FaVideo, FaBookOpen } from "react-icons/fa";
import avatar from "../../assets/profile_img_1.png";

export default function CourseReviewModal({ open, onClose, course }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-auto bg-white/30 rounded-3xl shadow-2xl p-8 glass-modal animate-slideIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-700 bg-white/60 rounded-full p-2 shadow hover:bg-blue-100 transition"
        >
          <FaTimesCircle size={24} />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <img src={avatar} alt="Educator" className="w-16 h-16 rounded-full border-4 border-blue-300 shadow-lg" />
          <div>
            <h2 className="text-2xl font-bold text-blue-900">{course?.educator || "Educator Name"}</h2>
            <p className="text-blue-700/80">Educator</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Course Lessons</h3>
          <div className="space-y-4">
            {(course?.lessons || [1, 2, 3]).map((lesson, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 shadow-md">
                <FaBookOpen className="text-blue-400 text-2xl" />
                <span className="font-medium text-blue-900">Lesson {idx + 1}</span>
                <button className="ml-auto bg-gradient-to-r from-blue-400 to-yellow-300 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition flex items-center gap-2">
                  <FaVideo /> Preview
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-yellow-300 text-white font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition flex items-center gap-2">
            <FaCheckCircle /> Approve
          </button>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-400 to-yellow-300 text-white font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition flex items-center gap-2">
            <FaTimesCircle /> Reject
          </button>
        </div>
      </div>
      <style>{`
        .glass-modal {
          animation: slideIn 0.5s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
