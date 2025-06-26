import React from 'react';
import { FaUser, FaEnvelope, FaUserShield, FaCalendarAlt, FaEye, FaCommentDots, FaBan } from 'react-icons/fa';
import avatar from '../../assets/profile_img_2.png';

export default function UserCardAdmin({ user }) {
  return (
    <div className="w-[260px]">
      <div className="relative bg-white/30 rounded-3xl shadow-2xl p-6 flex flex-col items-center glass-card transition-transform hover:scale-105">
        <img src={avatar} alt="User" className="w-20 h-20 rounded-full border-4 border-gradient-to-tr from-blue-400 to-yellow-300 shadow-xl mb-4" />
        <h3 className="text-xl font-bold text-blue-900">{user?.name || "Student Name"}</h3>
        <div className="w-full">
          <p className="truncate max-w-[180px] text-sm text-blue-700/80 flex items-center gap-2" title={user?.email || "student@email.com"}>
            <FaEnvelope /> {user?.email || "student@email.com"}
          </p>
        </div>
        <span className="mt-2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-400 to-yellow-300 text-white font-semibold text-xs shadow">{user?.role || "Student"}</span>
        <p className="mt-2 text-xs text-blue-500 flex items-center gap-2"><FaCalendarAlt /> Joined: {user?.joined || "2024-01-01"}</p>
        <div className="flex gap-3 mt-4">
          <button className="p-2 rounded-full bg-gradient-to-tr from-blue-400 to-yellow-300 text-white shadow hover:scale-110 transition"><FaEye /></button>
          <button className="p-2 rounded-full bg-gradient-to-tr from-blue-400 to-yellow-300 text-white shadow hover:scale-110 transition"><FaCommentDots /></button>
          <button className="p-2 rounded-full bg-gradient-to-tr from-red-400 to-yellow-300 text-white shadow hover:scale-110 transition"><FaBan /></button>
        </div>
        <style>{`
          .glass-card {
            box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18), 0 2px 8px 0 rgba(251,191,36,0.12);
          }
        `}</style>
      </div>
    </div>
  );
}
