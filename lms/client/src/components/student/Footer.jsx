import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Brand */}
        <div>
          <div className="flex items-center mb-4">
            <img src="/assets/logo.png" alt="GOFTY LOGO" className="h-10 mr-2" />
            <span className="text-xl font-bold text-gradient-to-r from-blue-400 to-yellow-400">GOFTY SOLUTIONS LMS</span>
          </div>
          <p className="text-gray-400">
            Learn smarter with our AI-powered platform. Practical, engaging, and designed for future-ready professionals.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-2">Company</h3>
          <ul className="space-y-1 text-gray-400">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/course-list">Courses</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-2">Resources</h3>
          <ul className="space-y-1 text-gray-400">
            <li><Link to="/calendar">Learning Calendar</Link></li>
            <li><Link to="/discussion">Community</Link></li>
            <li><Link to="/live-sessions">Live Sessions</Link></li>
            <li><Link to="/certificates">Certificates</Link></li>
            <li><Link to="/support">Support</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-gray-400 mb-2">Get the latest updates, offers, and course launches in your inbox.</p>
          <form className="flex items-center space-x-2">
            <input
              type="email"
              id="newsletter-email"
              name="email"
              autocomplete="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-md text-black"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white px-4 py-2 rounded-md font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} GOFTY SOLUTIONS LMS. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
