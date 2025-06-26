import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaCreditCard, 
  FaPaypal, 
  FaApple, 
  FaLock, 
  FaCheck, 
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaClock,
  FaPlay,
  FaDownload,
  FaCertificate,
  FaMobile,
  FaExclamationTriangle
} from 'react-icons/fa';
import { 
  SiVisa,
  SiMastercard,
  SiAmericanexpress
} from 'react-icons/si';

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isDesktop, setIsDesktop] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Check if screen is desktop size on mount and resize
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to purchase courses');
          navigate('/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        console.log('🔍 Fetching course details for checkout:', courseId);
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/approved`, config);
        
        // Find the specific course
        const course = response.data.find(c => c._id === courseId);
        
        if (!course) {
          throw new Error('Course not found or not approved');
        }

        // Transform the data for checkout
        const transformedCourse = {
          id: course._id,
          title: course.title,
          description: course.description || 'Learn and master new skills with this comprehensive course.',
          instructor: course.educator?.name || 'Expert Instructor',
          instructorTitle: 'Course Instructor',
          price: course.price || 0,
          originalPrice: course.price ? course.price * 1.3 : 0, // 30% discount simulation
          discount: 23,
          thumbnailUrl: course.thumbnailUrl,
          rating: course.rating || 4.5,
          students: course.enrolledCount || Math.floor(Math.random() * 1500) + 100,
          duration: course.duration || '12 hours',
          lessons: course.curriculum ? course.curriculum.reduce((total, section) => total + (section.lessons?.length || 0), 0) : 25,
          level: course.difficulty || 'Intermediate',
          features: [
            `${course.curriculum ? course.curriculum.reduce((total, section) => total + (section.lessons?.length || 0), 0) : 25} comprehensive lessons`,
            'Full lifetime access',
            'Certificate of completion',
            'Access on mobile and desktop',
            'Downloadable resources',
            '30-day money-back guarantee'
          ]
        };

        setCourseData(transformedCourse);

      } catch (err) {
        console.error('❌ Error fetching course details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, navigate]);

  // Card formatting functions
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const formatCvv = (value) => {
    return value.replace(/[^0-9]/gi, '').substring(0, 4);
  };

  // Detect card brand
  const getCardBrand = (number) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return null;
  };

  // Handle input changes with formatting
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (e) => {
    const formatted = formatCvv(e.target.value);
    setCvv(formatted);
  };

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      icon: FaCreditCard,
      description: 'Secure payment with major cards',
      color: 'blue',
      cardBrands: [
        { name: 'Visa', icon: SiVisa, color: 'text-blue-600' },
        { name: 'Mastercard', icon: SiMastercard, color: 'text-red-600' },
        { name: 'American Express', icon: SiAmericanexpress, color: 'text-blue-500' }
      ]
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: FaPaypal,
      description: 'Pay with your PayPal account',
      color: 'blue'
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: FaApple,
      description: 'Touch ID or Face ID',
      color: 'gray'
    }
  ];

  const handlePayment = async () => {
    try {
      setProcessing(true);
      
      // Simulate payment processing
      toast.info(`Processing payment of $${courseData.price} via ${selectedPaymentMethod}...`);
      
      // TODO: Implement actual payment processing here
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Call enrollment API endpoint here
      // const enrollmentResponse = await axios.post('/api/enrollments', { courseId }, config);
      
      toast.success('Payment successful! Welcome to the course!');
      
      // Navigate to course player
      navigate(`/student/course-player/${courseId}`);
      
    } catch (error) {
      console.error('❌ Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaExclamationTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Course
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Course data not available
  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Course not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Course
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Checkout
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Course Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={courseData.thumbnailUrl}
                    alt={courseData.title}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {courseData.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    by {courseData.instructor}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    {courseData.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {courseData.rating} ({courseData.students.toLocaleString()} students)
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      {courseData.duration}
                    </div>
                    <div className="flex items-center">
                      <FaPlay className="mr-1" />
                      {courseData.lessons} lessons
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Method
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ 
                      scale: 1.01,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-300 ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        selectedPaymentMethod === method.id
                          ? 'bg-blue-100 dark:bg-blue-800'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <method.icon className={`transition-colors duration-300 ${
                          selectedPaymentMethod === method.id
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {method.description}
                        </div>
                        {/* Card Brand Icons for Credit Card */}
                        {method.cardBrands && (
                          <div className="flex items-center space-x-2 mt-2">
                            {method.cardBrands.map((brand) => (
                              <brand.icon 
                                key={brand.name}
                                className={`w-6 h-6 ${brand.color} opacity-70`}
                                title={brand.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-500 scale-110'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedPaymentMethod === method.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaCheck className="w-3 h-3 text-white m-0.5" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Credit Card Form (shown when Stripe is selected) */}
              <AnimatePresence mode="wait">
                {selectedPaymentMethod === 'stripe' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mt-6 space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className="w-full px-3 py-3 pr-16 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                          />
                          {/* Card Brand Icon */}
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {getCardBrand(cardNumber) === 'visa' && (
                              <SiVisa className="w-8 h-5 text-blue-600" />
                            )}
                            {getCardBrand(cardNumber) === 'mastercard' && (
                              <SiMastercard className="w-8 h-5 text-red-600" />
                            )}
                            {getCardBrand(cardNumber) === 'amex' && (
                              <SiAmericanexpress className="w-8 h-5 text-blue-500" />
                            )}
                            {!getCardBrand(cardNumber) && cardNumber && (
                              <FaCreditCard className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          maxLength={5}
                          className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cvv}
                          onChange={handleCvvChange}
                          maxLength={4}
                          className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>


          </div>

          {/* Payment Summary Sidebar */}
          <div className="lg:col-span-4">
            {/* Mobile Summary Toggle */}
            <div className="lg:hidden mb-6">
              <motion.button
                onClick={() => setShowMobileSummary(!showMobileSummary)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 dark:text-white">
                    View Summary
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    (${courseData.price})
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: showMobileSummary ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                </motion.div>
              </motion.button>
            </div>

            {/* Summary Content */}
            <AnimatePresence>
              {(showMobileSummary || isDesktop) && (
                <motion.div
                  initial={{ opacity: 0, x: 20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8 lg:block overflow-hidden"
                >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>

              {/* Course in Cart */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <div className="flex gap-3">
                  <img
                    src={courseData.thumbnailUrl}
                    alt={courseData.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {courseData.title}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      by {courseData.instructor}
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
                  What's included:
                </h4>
                <div className="space-y-2 text-sm">
                  {courseData.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-gray-600 dark:text-gray-400">
                      <FaCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Original Price:</span>
                  <span className="line-through">${courseData.originalPrice}</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount ({courseData.discount}%):</span>
                  <span>-${(courseData.originalPrice - courseData.price).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span>${courseData.price}</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
              >
                <div className="flex items-center text-sm text-green-700 dark:text-green-400">
                  <FaLock className="mr-2 text-green-600 dark:text-green-400" />
                  Your payment info is secure
                </div>
              </motion.div>

              {/* Confirm and Pay Button */}
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform"
              >
                <FaLock className="mr-2" />
                Confirm and Pay ${courseData.price}
              </motion.button>

              {/* Money Back Guarantee */}
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                30-day money-back guarantee
              </div>
            </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 