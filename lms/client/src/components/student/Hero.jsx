import React from 'react';
import CoverflowSlider from './CoverflowSlider'; // Import CoverflowSlider

const Hero = () => {
  const heroImages = [
    '/assets/image1.jpg',
    '/assets/image2.jpg',
    '/assets/image3.jpg',
    '/assets/image4.jpg',
    '/assets/image5.jpg',
  ];

  return (
    <section className="w-full min-h-[100vh] bg-gradient-to-br from-blue-50 to-white flex flex-col md:flex-row items-center justify-between px-6 lg:px-20 pt-16 pb-20 relative overflow-hidden">
      {/* Optional: Add a subtle background pattern or texture here if desired, ensure it doesn't clash with the slider */}
      
      {/* Left Section: Text Content */}
      <div className="flex-1 text-center md:text-left mb-12 md:mb-0 md:pr-8 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-dark mb-4 animate-slide-in-left">
          Empower Your Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-yellow-400">AI-Driven Learning Excellence</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0 mb-8">
          Unlock your potential with our immersive, AI-powered courses designed for real-world impact. Explore while you learn.
        </p>
        <button className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white px-8 py-3 rounded-full font-semibold transition duration-300 hover:shadow-lg hover:scale-105 animate-bounce-once">
          Get Started Today
        </button>
      </div>

      {/* Right Section: Coverflow Slider */}
      <div className="flex-1 flex justify-center items-center md:pl-8">
        <CoverflowSlider images={heroImages} />
      </div>

      {/* SVG Wave Divider at the bottom */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <svg className="block w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,192L48,186.7C96,181,192,171,288,149.3C384,128,480,96,576,106.7C672,117,768,171,864,192C960,213,1056,203,1152,192C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
