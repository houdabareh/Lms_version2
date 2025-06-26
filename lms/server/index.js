const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectMongo = require('./config/mongo');

dotenv.config(); // Load .env variables
connectMongo();  // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import middleware
const authMiddleware = require('./middlewares/authMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes'); // <-- make sure this file exists
const scheduleRoutes = require('./routes/scheduleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const messageRoutes = require('./routes/messageRoutes');
const meetingRoutes = require('./routes/meetingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);
app.use('/api', downloadRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes); // <-- this endpoint now works
app.use('/api/schedule', scheduleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/meetings', meetingRoutes);

// 🔐 ADMIN ROUTES - Protected with admin-only authentication
app.use('/api/admin', authMiddleware(['admin']), adminRoutes);

// Root route
app.get('/', (req, res) => res.send('LMS backend is running.'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
