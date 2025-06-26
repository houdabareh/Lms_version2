import React from 'react';
import { assets } from '../../assets/assets';

const Companies = () => {
  return (
    <div className="bg-gradient-to-r from-[#f9fafb] to-[#fefefe]">
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-sm md:text-base mb-6 font-medium">
          Trusted by learners from
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <img
            src={assets.microsoft_logo}
            alt="Microsoft"
            className="h-10 md:h-12 transition-transform duration-300 hover:scale-110"
          />
          <img
            src={assets.walmart_logo}
            alt="Walmart"
            className="h-10 md:h-12 transition-transform duration-300 hover:scale-110"
          />
          <img
            src={assets.accenture_logo}
            alt="Accenture"
            className="h-10 md:h-12 transition-transform duration-300 hover:scale-110"
          />
          <img
            src={assets.adobe_logo}
            alt="Adobe"
            className="h-10 md:h-12 transition-transform duration-300 hover:scale-110"
          />
          <img
            src={assets.paypal_logo}
            alt="Paypal"
            className="h-10 md:h-12 transition-transform duration-300 hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default Companies;
