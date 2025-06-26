import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingActionButton from './FloatingActionButton';
import FloatingAssistant from './FloatingAssistant';

const StudentLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-4 pt-16 pb-8 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
      <FloatingActionButton />
      <FloatingAssistant />
    </div>
  );
};

export default StudentLayout; 