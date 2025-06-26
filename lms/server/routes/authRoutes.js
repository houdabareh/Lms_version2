const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const Otp = require('../models/Otp');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const LoginLog = require('../models/LoginLog');

// Fallback JWT secret for development (should use .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-development-secret-key-12345';

router.post('/register', register);
router.post('/login', login); // 🔐 OTP verification for students/educators
router.post('/admin-login', adminLogin); // 🔐 Separate admin login with OTP
router.get('/me', authMiddleware(), getMe);

router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const record = await Otp.findOne({ userId, otp });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await Otp.deleteMany({ userId });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 🔐 Generate JWT token with correct user role (works for all roles)
    const token = jwt.sign({ 
      id: user._id, 
      role: user.role,
      email: user.email,
      name: user.name
    }, JWT_SECRET, { expiresIn: '1d' });

    // 📝 Log successful verification with role tracking
    await LoginLog.create({
      userId: user._id,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      role: user.role,
              action: 'otp_verified',
      timestamp: new Date()
    });

    res.json({ 
      message: 'Login successful', 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

/*
🧪 POSTMAN TESTING GUIDE for OTP Verification:
1. POST to http://localhost:5000/api/auth/verify-otp
2. Body (JSON):
   {
     "userId": "USER_ID_FROM_LOGIN_RESPONSE",
     "otp": "123456"
   }
3. Expected Response: 
   {
     "message": "Login successful",
     "token": "JWT_TOKEN_HERE",
     "user": { "id": "...", "role": "admin", ... }
   }
4. Token will contain correct role for access control
5. Works for all user roles, but admin routes still protected by middleware
*/

// 🔐 ADMIN-ONLY ROUTE: Login logs access restricted to administrators
router.get('/login-logs/:userId', authMiddleware(['admin']), async (req, res) => {
  try {
    const logs = await LoginLog.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(50); // Limit results for performance
    
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (err) {
    console.error('Failed to fetch login logs:', err);
    res.status(500).json({ error: 'Failed to fetch login logs' });
  }
});

module.exports = router;
