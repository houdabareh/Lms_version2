import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, ClockIcon as ClockIconOutline, BookmarkIcon, CurrencyDollarIcon, AcademicCapIcon, RocketLaunchIcon, MegaphoneIcon, ArrowLongRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Sparkle, LightbulbFilament, GlobeHemisphereWest, Users, ChartLineUp, ShieldCheck, Lifebuoy, CalendarBlank, MapPin, Phone, Envelope, CheckCircle } from '@phosphor-icons/react';
import { ThemeContext } from '../context/ThemeContext';

// Dummy data - replace with actual data fetching in a real application
const coursesData = [
  {
    id: 'ai-for-beginners',
    slug: 'ai-for-beginners-fundamentals-applications',
    title: 'AI for Beginners: Fundamentals & Applications',
    category: 'Technology',
    rating: 4.8,
    reviews: 1200,
    duration: '10h',
    price: '$49.99',
    level: 'Beginner',
    instructor: {
      name: 'Dr. Anya Sharma',
      title: 'Lead AI Researcher',
      bio: 'Dr. Anya Sharma is a leading expert in artificial intelligence with over 15 years of experience in machine learning and data science. She holds a Ph.D. in Computer Science from Stanford University and has published numerous papers on neural networks and deep learning. Anya is passionate about making complex AI concepts accessible to everyone.',
      image: '../../assets/profile_img_1.png', // Placeholder image
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#',
      },
    },
    description: 'Learn the basics of Artificial Intelligence, machine learning concepts, and how AI powers modern applications in various industries.',
    whatYouWillLearn: [
      'Understand the fundamental concepts of Artificial Intelligence, Machine Learning, and Deep Learning.',
      'Explore various AI applications, including natural language processing and computer vision.',
      'Learn to implement basic machine learning algorithms using Python.',
      'Gain insights into the ethical considerations and future trends of AI.',
      'Develop a solid foundation for more advanced AI studies.',
    ],
    skillsGained: [
      'AI Fundamentals',
      'Machine Learning Basics',
      'Python Programming (basic)',
      'Data Analysis',
      'Problem Solving',
      'Critical Thinking',
    ],
    curriculum: [
      {
        section: 'Introduction to AI',
        lessons: [
          { title: 'What is AI and Why it Matters?', duration: '15 min' },
          { title: 'History and Evolution of AI', duration: '20 min' },
          { title: 'Types of AI: Narrow, General, Super', duration: '25 min' },
        ],
      },
      {
        section: 'Machine Learning Core Concepts',
        lessons: [
          { title: 'Supervised vs. Unsupervised Learning', duration: '30 min' },
          { title: 'Regression and Classification', duration: '40 min' },
          { title: 'Introduction to Neural Networks', duration: '35 min' },
        ],
      },
      {
        section: 'Practical AI with Python',
        lessons: [
          { title: 'Setting Up Your AI Environment', duration: '20 min' },
          { title: 'Building Your First ML Model', duration: '60 min' },
          { title: 'Data Preprocessing Techniques', duration: '45 min' },
        ],
      },
    ],
    whyTakeThisCourse: [
      'Future-proof your career by understanding the most impactful technology of our time.',
      'Learn from a highly experienced AI researcher and educator.',
      'Hands-on projects to solidify your understanding and build a portfolio.',
      'Access to a vibrant community of learners and AI enthusiasts.',
      'Receive a certificate of completion to showcase your new skills.',
    ],
  },
  {
    id: 'digital-marketing-mastery',
    slug: 'digital-marketing-mastery-seo-sem-social-media',
    title: 'Digital Marketing Mastery: SEO, SEM & Social Media',
    category: 'Business',
    rating: 4.7,
    reviews: 980,
    duration: '15h',
    price: '$79.99',
    level: 'Intermediate',
    instructor: {
      name: 'Mark Jansen',
      title: 'Digital Marketing Strategist',
      bio: 'Mark Jansen is a seasoned digital marketing professional with over 10 years of experience in developing and executing successful online campaigns for various industries. He specializes in SEO, SEM, content marketing, and social media advertising, helping businesses achieve significant online growth.',
      image: '../../assets/profile_img_1.png',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#',
      },
    },
    description: 'Master essential digital marketing strategies including SEO, SEM, content marketing, and social media campaigns to boost your brand. This comprehensive course covers everything you need to know to create effective digital marketing plans.',
    whatYouWillLearn: [
      'Develop a comprehensive digital marketing strategy.',
      'Master Search Engine Optimization (SEO) techniques for higher rankings.',
      'Implement effective Search Engine Marketing (SEM) campaigns.',
      'Create engaging content marketing strategies.',
      'Utilize social media platforms for brand growth and engagement.',
      'Analyze digital marketing performance and optimize for results.',
    ],
    skillsGained: [
      'Digital Marketing Strategy',
      'SEO & SEM',
      'Content Marketing',
      'Social Media Marketing',
      'Google Analytics',
      'Campaign Management',
    ],
    curriculum: [
      {
        section: 'Introduction to Digital Marketing',
        lessons: [
          { title: 'Overview of Digital Marketing', duration: '20 min' },
          { title: 'Understanding Your Target Audience', duration: '25 min' },
        ],
      },
      {
        section: 'Search Engine Optimization (SEO)',
        lessons: [
          { title: 'Keyword Research', duration: '30 min' },
          { title: 'On-Page SEO Techniques', duration: '40 min' },
          { title: 'Off-Page SEO & Link Building', duration: '35 min' },
        ],
      },
      {
        section: 'Social Media Marketing',
        lessons: [
          { title: 'Platform Selection & Strategy', duration: '20 min' },
          { title: 'Content Creation for Social Media', duration: '60 min' },
        ],
      },
    ],
    whyTakeThisCourse: [
      'Gain practical skills to boost your career in digital marketing.',
      'Learn from an industry expert with proven strategies.',
      'Hands-on exercises and real-world case studies.',
      'Stay updated with the latest digital marketing trends.',
      'Receive a certificate of completion.',
    ],
  },
  {
    id: 'full-stack-web-development',
    slug: 'full-stack-web-development-mern-stack',
    title: 'Full Stack Web Development: MERN Stack',
    category: 'Development',
    rating: 4.9,
    reviews: 2500,
    duration: '40h',
    price: '$199.99',
    level: 'Advanced',
    instructor: {
      name: 'Sarah Connor',
      title: 'Senior Software Engineer',
      bio: 'Sarah Connor is a senior software engineer with extensive experience in full-stack development, specializing in the MERN stack. She has built and deployed numerous scalable web applications and is passionate about teaching best practices in software development.',
      image: '../../assets/profile_img_1.png',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#',
      },
    },
    description: 'Become a full-stack developer by building dynamic web applications using MongoDB, Express.js, React, and Node.js. This intensive course covers both front-end and back-end development.',
    whatYouWillLearn: [
      'Build robust RESTful APIs with Node.js and Express.js.',
      'Design and manage NoSQL databases with MongoDB.',
      'Develop interactive user interfaces with React.js.',
      'Integrate front-end and back-end to create full-stack applications.',
      'Implement authentication and authorization in web applications.',
      'Deploy MERN stack applications to the cloud.',
    ],
    skillsGained: [
      'Node.js',
      'Express.js',
      'React.js',
      'MongoDB',
      'RESTful APIs',
      'Full-Stack Development',
    ],
    curriculum: [
      {
        section: 'Introduction to MERN Stack',
        lessons: [
          { title: 'Overview of MERN Architecture', duration: '30 min' },
          { title: 'Setting Up Your Development Environment', duration: '45 min' },
        ],
      },
      {
        section: 'Backend Development with Node.js & Express.js',
        lessons: [
          { title: 'Building RESTful APIs', duration: '90 min' },
          { title: 'Database Integration with MongoDB', duration: '75 min' },
        ],
      },
      {
        section: 'Frontend Development with React.js',
        lessons: [
          { title: 'React Components and State Management', duration: '120 min' },
          { title: 'Fetching Data from APIs', duration: '60 min' },
        ],
      },
      {
        section: 'Connecting Frontend and Backend & Deployment',
        lessons: [
          { title: 'Full-Stack Integration', duration: '90 min' },
          { title: 'Deployment Strategies', duration: '60 min' },
        ],
      },
    ],
    whyTakeThisCourse: [
      'Become a highly sought-after full-stack developer.',
      'Build real-world projects to showcase your skills.',
      'Learn from an experienced software engineer.',
      'Access to a community of aspiring developers.',
      'Receive a certification upon completion.',
    ],
  },
  {
    id: 'data-science-with-python',
    slug: 'data-science-with-python-from-basics-to-advanced',
    title: 'Data Science with Python: From Basics to Advanced',
    category: 'Data Science',
    rating: 4.6,
    reviews: 1800,
    duration: '25h',
    price: '$129.99',
    level: 'Intermediate',
    instructor: {
      name: 'Dr. David Lee',
      title: 'Senior Data Scientist',
      bio: 'Dr. David Lee is a senior data scientist with a background in statistics and computer science. He has worked on various data-driven projects in finance and healthcare, using Python for analysis, machine learning, and visualization. David is passionate about teaching practical data science skills.',
      image: '../../assets/profile_img_1.png',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#',
      },
    },
    description: 'Explore data analysis, visualization, and machine learning using Python libraries like Pandas, NumPy, and Scikit-learn. This course takes you from foundational concepts to advanced data science techniques.',
    whatYouWillLearn: [
      'Master Python for data manipulation and analysis.',
      'Perform data visualization using Matplotlib and Seaborn.',
      'Understand core machine learning algorithms.',
      'Build and evaluate predictive models.',
      'Apply data science techniques to real-world datasets.',
      'Clean, preprocess, and prepare data for analysis.',
    ],
    skillsGained: [
      'Python for Data Science',
      'Pandas & NumPy',
      'Data Visualization',
      'Machine Learning',
      'Statistical Analysis',
      'Predictive Modeling',
    ],
    curriculum: [
      {
        section: 'Python Fundamentals for Data Science',
        lessons: [
          { title: 'Python Basics & Data Structures', duration: '60 min' },
          { title: 'Introduction to NumPy and Pandas', duration: '90 min' },
        ],
      },
      {
        section: 'Data Analysis and Visualization',
        lessons: [
          { title: 'Data Cleaning and Preprocessing', duration: '75 min' },
          { title: 'Exploratory Data Analysis', duration: '60 min' },
          { title: 'Creating Visualizations with Matplotlib/Seaborn', duration: '90 min' },
        ],
      },
      {
        section: 'Machine Learning with Scikit-learn',
        lessons: [
          { title: 'Supervised Learning: Regression', duration: '120 min' },
          { title: 'Supervised Learning: Classification', duration: '120 min' },
          { title: 'Model Evaluation and Selection', duration: '60 min' },
        ],
      },
    ],
    whyTakeThisCourse: [
      'Gain a strong foundation in data science with Python.',
      'Work on practical projects to build your portfolio.',
      'Learn from an experienced data scientist.',
      'Prepare for a career in data analysis or machine learning.',
      'Receive a recognized certificate.',
    ],
  },
  {
    id: 'graphic-design-fundamentals',
    slug: 'graphic-design-fundamentals-adobe-creative-suite',
    title: 'Graphic Design Fundamentals: Adobe Creative Suite',
    category: 'Design',
    rating: 4.5,
    reviews: 750,
    duration: '20h',
    price: '$99.99',
    level: 'Beginner',
    instructor: {
      name: 'Emily White',
      title: 'Creative Director & Designer',
      bio: 'Emily White is a highly acclaimed creative director and graphic designer with over a decade of experience in branding, advertising, and digital design. She has led numerous successful design projects for top agencies and is passionate about nurturing new talent in the design world.',
      image: '../../assets/profile_img_1.png',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#',
      },
    },
    description: 'Learn the principles of graphic design and master tools like Photoshop, Illustrator, and InDesign to create stunning visuals. This course is perfect for aspiring designers and marketing professionals.',
    whatYouWillLearn: [
      'Understand the core principles of graphic design (typography, color theory, layout).',
      'Master Adobe Photoshop for image editing and manipulation.',
      'Create vector graphics and illustrations with Adobe Illustrator.',
      'Design professional layouts and publications using Adobe InDesign.',
      'Develop a strong visual portfolio.',
      'Apply design concepts to real-world projects.',
    ],
    skillsGained: [
      'Graphic Design',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe InDesign',
      'Typography',
      'Color Theory',
    ],
    curriculum: [
      {
        section: 'Introduction to Graphic Design',
        lessons: [
          { title: 'What is Graphic Design?', duration: '20 min' },
          { title: 'Design Principles: Balance, Contrast, Hierarchy', duration: '30 min' },
        ],
      },
      {
        section: 'Adobe Photoshop Essentials',
        lessons: [
          { title: 'Interface and Basic Tools', duration: '60 min' },
          { title: 'Image Editing and Retouching', duration: '90 min' },
        ],
      },
      {
        section: 'Adobe Illustrator for Vector Graphics',
        lessons: [
          { title: 'Creating Shapes and Paths', duration: '75 min' },
          { title: 'Working with Text and Colors', duration: '60 min' },
        ],
      },
      {
        section: 'Adobe InDesign for Layout',
        lessons: [
          { title: 'Document Setup and Master Pages', duration: '75 min' },
          { title: 'Creating Multi-page Layouts', duration: '60 min' },
        ],
      },
    ],
    whyTakeThisCourse: [
      'Build a strong foundation in graphic design.',
      'Master industry-standard Adobe Creative Suite tools.',
      'Create a professional design portfolio.',
      'Get personalized feedback on your design projects.',
      'Receive a certificate of achievement.',
    ],
  },
];

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = coursesData.find((c) => c.slug === courseId);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleEnrollNow = () => {
    // Debug logging
    console.log('CourseDetails - course object:', course);
    console.log('CourseDetails - course.id:', course.id);
    console.log('CourseDetails - courseId from URL:', courseId);
    console.log('CourseDetails - Navigating to:', `/checkout/${course.id}`);
    
    // Navigate to checkout page with course ID (using public route for now)
    navigate(`/checkout/${course.id}`);
  };

  if (!course) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        <h1 className="text-4xl font-bold">Course Not Found</h1>
      </div>
    );
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navbar - Copied from Homepage.jsx */}
      <nav className={`fixed top-0 left-0 w-full z-40 py-4 shadow-lg transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900 bg-opacity-90 backdrop-blur-md' : 'bg-white bg-opacity-90 backdrop-blur-md'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent transition-all duration-300 transform hover:scale-105">GFS</Link>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className={`text-lg font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-200 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>
                {link.name}
                <span className={`absolute left-0 bottom-0 w-full h-0.5 transition-all duration-300 origin-left transform scale-x-0 group-hover:scale-x-100 ${theme === 'dark' ? 'bg-primary' : 'bg-primary'}`}></span>
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {theme === 'dark' ? <Sparkle className="h-6 w-6" /> : <LightbulbFilament className="h-6 w-6" />}
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden px-6 pb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex flex-col space-y-3 mt-4">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.href} className={`block text-lg font-medium py-2 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center justify-center w-full px-4 py-2 rounded-md transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {theme === 'dark' ? <Sparkle className="h-6 w-6 mr-2" /> : <LightbulbFilament className="h-6 w-6 mr-2" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="pt-20"> {/* Padding to account for fixed navbar */}
        {/* Hero Section */}
        <section className={`py-16 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
          <div className="container mx-auto px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-gray-900 dark:text-white"
            >
              {course.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-3xl"
            >
              {course.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-4 text-gray-800 dark:text-gray-200 mb-8"
            >
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                <span>{course.rating} ({course.reviews} reviews)</span>
              </div>
              <div className="flex items-center">
                <ClockIconOutline className="h-5 w-5 text-primary mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-green-500 mr-1" />
                <span>{course.level}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <button 
                onClick={handleEnrollNow}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300 flex items-center"
              >
                <BookmarkIcon className="h-5 w-5 mr-2" /> Enroll Now - {course.price}
              </button>
              <button className={`px-8 py-3 border border-primary ${theme === 'dark' ? 'text-primary hover:bg-primary/10' : 'text-primary hover:bg-blue-50'} font-semibold rounded-full transition-colors duration-300`}>
                Add to Wishlist
              </button>
            </motion.div>
          </div>
        </section>

        {/* Quick Facts Bar */}
        <section className={`py-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-primary mb-2" />
              <span className="text-xl font-bold">1M+</span>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Students Enrolled</p>
            </div>
            <div className="flex flex-col items-center">
              <ClockIconOutline className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-xl font-bold">24/7</span>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Lifetime Access</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-8 w-8 text-yellow-500 mb-2" />
              <span className="text-xl font-bold">Certified</span>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Completion</p>
            </div>
            <div className="flex flex-col items-center">
              <Lifebuoy className="h-8 w-8 text-red-500 mb-2" />
              <span className="text-xl font-bold">Dedicated</span>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Support</p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn */}
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">What You'll Learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                {course.whatYouWillLearn.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center text-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" weight="fill" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </section>

            {/* Skills You'll Gain */}
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Skills You'll Gain</h2>
              <div className="flex flex-wrap gap-3">
                {course.skillsGained.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`px-5 py-2 rounded-full text-lg font-medium ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </section>

            {/* Course Curriculum */}
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Course Curriculum</h2>
              <div className="space-y-4">
                {course.curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${theme === 'dark' ? 'border border-gray-700' : 'border border-gray-200'}`}>
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                      <CalendarBlank className="h-6 w-6 text-primary mr-3" /> {section.section}
                    </h3>
                    <ul className="space-y-3">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                          <span>{lesson.title}</span>
                          <span className="text-gray-500 dark:text-gray-400">{lesson.duration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructor Section */}
            <section className={`bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md ${theme === 'dark' ? 'border border-gray-700' : 'border border-gray-200'}`}>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">About the Instructor</h2>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <img
                  src={course.instructor.image}
                  alt={course.instructor.name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-primary"
                />
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{course.instructor.name}</h3>
                  <p className="text-primary text-lg mb-3">{course.instructor.title}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-md leading-relaxed">
                    {course.instructor.bio}
                  </p>
                  <div className="flex justify-center md:justify-start space-x-4 mt-4">
                    {/* Add instructor social links if available */}
                  </div>
                </div>
              </div>
            </section>

            {/* Why Take This Course */}
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Why Take This Course?</h2>
              <ul className="space-y-4 list-none p-0">
                {course.whyTakeThisCourse.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start text-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  >
                    <ArrowLongRightIcon className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-1" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </section>

            {/* Testimonials (Optional) */}
            {/* You can re-introduce the Swiper component here if needed, along with dummy testimonial data */}

          </div>

          {/* Sticky CTA / Course Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className={`sticky top-28 p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Course Summary</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
                  <span>Category:</span>
                  <span className="font-semibold">{course.category}</span>
                </li>
                <li className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
                  <span>Duration:</span>
                  <span className="font-semibold">{course.duration}</span>
                </li>
                <li className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
                  <span>Level:</span>
                  <span className="font-semibold">{course.level}</span>
                </li>
                <li className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
                  <span>Reviews:</span>
                  <span className="font-semibold flex items-center">
                    {course.rating} <StarIcon className="h-5 w-5 text-yellow-400 ml-1" /> ({course.reviews})
                  </span>
                </li>
              </ul>
              <div className="text-center">
                <span className="text-4xl font-bold text-primary mr-2">{course.price}</span>
                <p className="text-gray-600 dark:text-gray-400 mb-6">One-time payment</p>
                <button 
                  onClick={handleEnrollNow}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg hover:from-primary-dark hover:to-accent-dark transition-all duration-300 flex items-center justify-center"
                >
                  <BookmarkIcon className="h-5 w-5 mr-2" /> Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Copied from Homepage.jsx */}
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
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
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
    </div>
  );
};

export default CourseDetailsPage;