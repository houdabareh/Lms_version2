const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const LoginLog = require('../models/LoginLog');
const authMiddleware = require('../middlewares/authMiddleware');

// 📊 Admin Dashboard - Get platform statistics
router.get('/dashboard', async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, recentLogs] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      LoginLog.find().sort({ timestamp: -1 }).limit(10).populate('userId', 'name email role')
    ]);

    const stats = {
      totalUsers,
      totalCourses,
      totalEnrollments,
      recentActivity: recentLogs
    };

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// 👥 Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 📚 Get all courses with pending approval status
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('educator', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// 📖 Get single course by ID (admin access - all statuses)
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('educator', 'name email');

    if (!course) {
      return res.status(404).json({ 
        success: false, 
        error: 'Course not found' 
      });
    }

    // Debug logging for AI content
    console.log('🔍 Debug: Course curriculum analysis');
    console.log('Course ID:', req.params.id);
    console.log('Course Title:', course.title);
    console.log('Curriculum sections:', course.curriculum.length);
    
    course.curriculum.forEach((section, sIndex) => {
      console.log(`\n📖 Section ${sIndex + 1}: ${section.title}`);
      console.log(`   Lessons: ${section.lessons.length}`);
      
      section.lessons.forEach((lesson, lIndex) => {
        console.log(`\n   📝 Lesson ${lIndex + 1}: ${lesson.title}`);
        console.log(`      Summary: ${lesson.summary ? 'YES (' + lesson.summary.substring(0, 50) + '...)' : 'NO'}`);
        console.log(`      Questions: ${lesson.questions && lesson.questions.length > 0 ? 'YES (' + lesson.questions.length + ')' : 'NO'}`);
        console.log(`      Video: ${lesson.videoUrl ? 'YES' : 'NO'}`);
        console.log(`      Material: ${lesson.materialUrl ? 'YES' : 'NO'}`);
        
        if (lesson.questions && lesson.questions.length > 0) {
          lesson.questions.forEach((q, qIndex) => {
            console.log(`        Q${qIndex + 1}: ${q}`);
          });
        }
      });
    });

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch course' 
    });
  }
});

// ✅ Approve course
router.put('/courses/:id/approve', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('educator', 'name email');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      success: true,
      message: 'Course approved successfully',
      data: course
    });
  } catch (error) {
    console.error('Course approval error:', error);
    res.status(500).json({ error: 'Failed to approve course' });
  }
});

// ❌ Reject course
router.put('/courses/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectedBy: req.user.id,
        rejectedAt: new Date(),
        rejectionReason: reason
      },
      { new: true }
    ).populate('educator', 'name email');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      success: true,
      message: 'Course rejected successfully',
      data: course
    });
  } catch (error) {
    console.error('Course rejection error:', error);
    res.status(500).json({ error: 'Failed to reject course' });
  }
});

// 📈 Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const [usersByRole, coursesByStatus, enrollmentTrends] = await Promise.all([
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      Course.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Enrollment.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$enrolledAt' },
              year: { $year: '$enrolledAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        usersByRole,
        coursesByStatus,
        enrollmentTrends
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// 🔒 Get login logs (already protected in authRoutes, but can be accessed here too)
router.get('/login-logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const logs = await LoginLog.find()
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LoginLog.countDocuments();

    res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Login logs error:', error);
    res.status(500).json({ error: 'Failed to fetch login logs' });
  }
});

// Filter by status
router.get('/courses/status/:status', async (req, res) => {
  try {
    const validStatuses = ['pending', 'approved', 'rejected'];
    const status = req.params.status;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid course status' });
    }

    const courses = await Course.find({ status })
      .populate('educator', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Get filtered courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses by status' });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully',
      data: course
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Note: AI content is now automatically generated during course submission
// No manual AI generation needed anymore

module.exports = router; 