import React, { useState, Fragment } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PhoneIcon, TicketIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const faqData = [
  {
    question: "How do I add a new course?",
    answer: "Navigate to 'My Courses' and click the 'Add New Course' button. Fill in the course details and save.",
  },
  {
    question: "Can I customize my dashboard view? ",
    answer: "Yes, in 'Settings' under 'Platform Preferences', you can adjust various display options.",
  },
  {
    question: "What is the average response time for support tickets?",
    answer: "Our average response time is typically within 2 hours during business days.",
  },
  {
    question: "How do I reset my password?",
    answer: "Go to 'Settings', then 'Profile Settings', and you'll find an option to change your password.",
  },
];

const Support = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-darkBg p-6 sm:p-8 lg:p-10 font-inter"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">Support</h1>

        {/* Need Help? Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <QuestionMarkCircleIcon className="h-8 w-8 mr-3 text-primary-dark" /> Need Help?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Popular Questions */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Popular Questions</h3>
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <Disclosure as="div" key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between items-center px-5 py-4 text-left text-lg font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                          <span>{faq.question}</span>
                          <ChevronDownIcon
                            className={`${
                              open ? 'transform rotate-180' : ''
                            } h-6 w-6 text-primary-dark transition-transform duration-200`}
                          />
                        </Disclosure.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Disclosure.Panel className="px-5 pt-0 pb-4 text-gray-700 dark:text-gray-300">
                            {faq.answer}
                          </Disclosure.Panel>
                        </Transition>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Contact Support</h3>
              <div className="space-y-4">
                <div className="flex items-start bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg shadow-sm">
                  <ChatBubbleLeftRightIcon className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Live Chat</h4>
                    <p className="text-blue-700 dark:text-blue-300">Instant support during business hours.</p>
                    <button className="mt-2 text-primary font-medium hover:underline">Start Chat</button>
                  </div>
                </div>

                <div className="flex items-start bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow-sm">
                  <EnvelopeIcon className="h-7 w-7 text-green-600 dark:text-green-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">Email Support</h4>
                    <p className="text-green-700 dark:text-green-300">Send us an email and we'll get back to you.</p>
                    <Link to="mailto:support@lms.com" className="mt-2 text-primary font-medium hover:underline">
                      Email Us
                    </Link>
                  </div>
                </div>

                <div className="flex items-start bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg shadow-sm">
                  <PhoneIcon className="h-7 w-7 text-purple-600 dark:text-purple-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Call Support</h4>
                    <p className="text-purple-700 dark:text-purple-300">Speak directly with a support agent.</p>
                    <Link to="tel:+1234567890" className="mt-2 text-primary font-medium hover:underline">
                      Call Now
                    </Link>
                  </div>
                </div>

                <div className="flex items-start bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-sm">
                  <TicketIcon className="h-7 w-7 text-yellow-600 dark:text-yellow-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Submit a Ticket</h4>
                    <p className="text-yellow-700 dark:text-yellow-300">For non-urgent issues, create a support ticket.</p>
                    <button className="mt-2 text-primary font-medium hover:underline">Open Form</button>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-md text-gray-600 dark:text-gray-400 text-center">
                Avg. Response Time: <span className="font-semibold text-primary">2 hours</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Support; 