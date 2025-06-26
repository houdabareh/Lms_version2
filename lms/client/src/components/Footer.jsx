import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Envelope } from '@phosphor-icons/react';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className={`py-12 ${theme === 'dark' ? 'bg-gray-950 text-gray-300' : 'bg-gray-800 text-gray-300'}`}>
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-extrabold text-white mb-4">GFS</h3>
          <p className="text-gray-400">Empowering Minds, Shaping Futures.</p>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
          <ul>
            <li className="mb-2"><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</Link></li>
            <li className="mb-2"><Link to="/courses" className="text-gray-400 hover:text-white transition-colors duration-300">Courses</Link></li>
            <li className="mb-2"><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Support</h4>
          <ul>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">FAQ</a></li>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Help Center</a></li>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Contact Us</h4>
          <p className="flex items-center text-gray-400 mb-2"><MapPin className="h-5 w-5 mr-2" /> 123 Education Lane, Learning City</p>
          <p className="flex items-center text-gray-400 mb-2"><Phone className="h-5 w-5 mr-2" /> +1 (123) 456-7890</p>
          <p className="flex items-center text-gray-400 mb-2"><Envelope className="h-5 w-5 mr-2" /> info@gfs.com</p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} GFS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 