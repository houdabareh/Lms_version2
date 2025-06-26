const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middlewares/authMiddleware');

// Example route for getting schedules
router.get('/', authMiddleware(['educator', 'student', 'admin']), scheduleController.getSchedules);

// Example route for creating/updating a schedule event
router.post('/', authMiddleware(['educator', 'admin']), scheduleController.createOrUpdateEvent);

// Route for deleting a schedule event
router.delete('/:id', authMiddleware(['educator', 'admin']), scheduleController.deleteEvent);

module.exports = router;
