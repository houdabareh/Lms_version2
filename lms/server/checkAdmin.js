const mongoose = require('mongoose');

// Multiple MongoDB connection URIs to try
const possibleUris = [
  process.env.MONGODB_URI,
  'mongodb://localhost:27017/lms_db',
  'mongodb://127.0.0.1:27017/lms_db',
  'mongodb://localhost:27017/lms',
  'mongodb://127.0.0.1:27017/lms'
];

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'educator', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function connectToMongoDB() {
  for (const uri of possibleUris) {
    if (!uri) continue;
    
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ Connected to MongoDB:', uri);
      return true;
    } catch (error) {
      // Try next URI
    }
  }
  return false;
}

async function checkAdmin() {
  try {
    const connected = await connectToMongoDB();
    
    if (!connected) {
      console.log('❌ Could not connect to MongoDB');
      console.log('🔧 The admin was NOT added because database connection failed');
      return false;
    }

    // Check if admin exists
    const admin = await User.findOne({ email: 'aifounderstudio@gmail.com' });
    
    if (admin) {
      console.log('✅ ADMIN USER EXISTS!');
      console.log('📋 Admin details:');
      console.log('   Name:', admin.name);
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      console.log('   Created:', admin.createdAt);
      console.log('\n🎉 You can login with:');
      console.log('   Email: aifounderstudio@gmail.com');
      console.log('   Password: 1234567');
      return true;
    } else {
      console.log('❌ ADMIN USER NOT FOUND');
      console.log('💡 The admin user with email "aifounderstudio@gmail.com" does not exist in the database');
      return false;
    }

  } catch (error) {
    console.error('❌ Error checking admin:', error.message);
    return false;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignore
    }
    process.exit(0);
  }
}

checkAdmin(); 