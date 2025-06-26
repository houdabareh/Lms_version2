const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Get enrollments for educator's courses
exports.getEnrollmentsForEducator = async (req, res) => {
  try {
    const educatorId = req.user.id;

    // Get courses created by educator
    const educatorCourses = await Course.find({ educator: educatorId }).select('_id');
    const courseIds = educatorCourses.map(course => course._id);

    // Get enrollments for those courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ enrolledAt: -1 });

    res.status(200).json(enrollments);
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllEnrollments = async (req, res) => {
  res.status(200).json({ message: 'Get all enrollments - Not yet implemented' });
};
exports.enrollInCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ message: 'studentId and courseId are required.' });
    }

    // Check if course exists and is approved
    const course = await Course.findById(courseId);
    if (!course || course.status !== 'approved') {
      return res.status(403).json({ message: 'This course is not available for enrollment.' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(409).json({ message: 'Student already enrolled in this course.' });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
    });

    await enrollment.save();

    res.status(201).json({
      message: 'Enrollment successful.',
      enrollment,
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error during enrollment.' });
  }
};

exports.getEnrollmentsByStudent = async (req, res) => {
  res.status(200).json({ message: 'Get enrollments by student - Not yet implemented' });
};

exports.getEnrollmentsByCourse = async (req, res) => {
  res.status(200).json({ message: 'Get enrollments by course - Not yet implemented' });
};
