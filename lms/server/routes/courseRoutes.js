const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

const { getEnrollmentsForEducator } = require('../controllers/enrollmentController');


// 📚 COURSE ROUTES - Protected by role-based middleware

// GET only approved courses for public access (students)
router.get('/approved', authMiddleware(['student', 'educator', 'admin']), courseController.getApprovedCourses);

// GET courses by educator (protected - includes all statuses for educator dashboard)
router.get('/', authMiddleware(['educator', 'admin']), courseController.getCoursesByEducator);

// POST create course (educators and admins only)
router.post('/', authMiddleware(['educator', 'admin']), courseController.createCourse);

// GET that one course by id (only approved courses for public access)
router.get('/:id', authMiddleware(['student', 'educator', 'admin']), courseController.getCourseById);

// Validate course for payment (prevent payment for non-approved courses)
router.get('/:id/validate-payment', authMiddleware(['student', 'educator', 'admin']), courseController.validateCourseForPayment);

// UPDATE the course (educators and admins only)
router.put('/:id', authMiddleware(['educator', 'admin']), courseController.updateCourse);

// DELETE the course (educators and admins only)
router.delete('/:id', authMiddleware(['educator', 'admin']), courseController.deleteCourse);

//get enrollement
router.get('/enrollments', authMiddleware(['educator', 'admin']), getEnrollmentsForEducator);

module.exports = router;
