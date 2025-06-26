import React from 'react';

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-accent text-white shadow-lg" data-aos="fade-up">
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center">
          <span className="mr-3 text-5xl">🚀</span> Ready to Start Your Learning Journey?
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Join thousands of students and unlock your full potential today.
        </p>
        <button className="bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105">
          Sign Up Now
        </button>
        <p className="mt-8 text-sm md:text-base opacity-90">
          ⭐ Trusted by 2,300+ students worldwide
        </p>
      </div>
    </section>
  );
};

export default CallToAction;