const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Enroll a student in a course
router.post('/', authMiddleware(['student']), enrollmentController.enrollInCourse);

// Get all enrollments (admin only)
router.get('/', authMiddleware(['educator', 'admin']), enrollmentController.getEnrollmentsForEducator);

// Get enrollments by student
router.get('/student/:userId', authMiddleware(['student', 'educator', 'admin']), enrollmentController.getEnrollmentsByStudent);

// Get enrollments by course
router.get('/course/:courseId', authMiddleware(['educator', 'admin']), enrollmentController.getEnrollmentsByCourse);

module.exports = router;
