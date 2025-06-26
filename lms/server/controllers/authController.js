const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
const sendOtpEmail = require('../utils/mailer');
const LoginLog = require('../models/LoginLog');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 🔐 SECURITY: Prevent public admin registration
    // Admin users must be created manually in MongoDB or via CLI
    if (role === 'admin') {
      return res.status(403).json({ 
        error: 'Admin registration not allowed',
        message: 'Admin accounts must be created manually by system administrators'
      });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    // Only allow educator and student roles for public registration
    const allowedRoles = ['educator', 'student'];
    const userRole = allowedRoles.includes(role) ? role : 'student'; // Default to student

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role: userRole,
      isVerified: false // Require verification for non-admin users
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: userWithoutPassword,
      allowedRoles
    });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/*
🧪 POSTMAN TESTING GUIDE for Registration:
1. POST to http://localhost:5000/api/auth/register
2. Body (JSON):
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "role": "student" // or "educator"
   }
3. Admin role will be rejected: 403 "Admin registration not allowed"
4. Only "educator" and "student" roles are allowed for public registration
*/

// 🔐 ADMIN LOGIN - Separate endpoint for admin authentication with OTP
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // 🔐 ADMIN SECURITY: Only allow admin users to proceed with login
    // This ensures only manually created admin users can access the admin panel
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied: Admin privileges required',
        message: 'This login endpoint is restricted to admin users only',
        userRole: user.role
      });
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await LoginLog.create({
      userId: user._id,
      ip,
      userAgent,
      role: user.role, // Track admin login attempts
      action: 'admin_login_attempt',
      timestamp: new Date()
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

    await Otp.create({ userId: user._id, otp, expiresAt });
    
    // 📧 Only send OTP to admin users (role verification already passed above)
    await sendOtpEmail(user.email, otp);

    res.json({ 
      message: 'OTP sent to admin email', 
      userId: user._id,
      role: user.role // Confirm admin role in response
    });
  } catch (err) {
    console.error('Admin login failed:', err);
    res.status(500).json({ error: 'Admin login failed' });
  }
};

// 👥 REGULAR USER LOGIN - Send OTP for ALL users (students and educators)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // 🚫 Block admin users from regular login - they must use admin-login
    if (user.role === 'admin') {
      return res.status(403).json({ 
        error: 'Admin users must use admin login',
        message: 'Please use the admin login endpoint for admin access'
      });
    }

    // Log regular user login
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await LoginLog.create({
      userId: user._id,
      ip,
      userAgent,
      role: user.role,
      action: 'user_login_attempt',
      timestamp: new Date()
    });

    // 🔐 Generate and send OTP for ALL regular users (students, educators)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

    await Otp.create({ userId: user._id, otp, expiresAt });
    
    // 📧 Send OTP to all users
    await sendOtpEmail(user.email, otp);

    res.json({ 
      message: 'OTP sent to your email. Please check your inbox.', 
      userId: user._id,
      role: user.role,
      email: user.email
    });
  } catch (err) {
    console.error('User login failed:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

/*
🧪 POSTMAN TESTING GUIDE for Admin Login:
1. POST to http://localhost:5000/api/auth/admin-login
2. Body (JSON):
   {
     "email": "h.elbarehoumi1577@uca.ac.ma",
     "password": "1234567"
   }
3. Expected Response: { "message": "OTP sent to admin email", "userId": "...", "role": "admin" }
4. Non-admin users will get 403 error: "Access denied: Admin privileges required"

🧪 POSTMAN TESTING GUIDE for Regular User Login:
1. POST to http://localhost:5000/api/auth/login
2. Body (JSON):
   {
     "email": "student@example.com",
     "password": "password123"
   }
3. Expected Response: { "message": "Login successful", "token": "JWT_TOKEN", "user": {...} }
4. Admin users will get 403 error: "Admin users must use admin login"
*/

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
