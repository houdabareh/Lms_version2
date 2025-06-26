const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Multiple MongoDB connection URIs to try
const possibleUris = [
  process.env.MONGODB_URI,
  'mongodb://localhost:27017/lms_db',
  'mongodb://127.0.0.1:27017/lms_db',
  'mongodb://localhost:27017/lms',
  'mongodb://127.0.0.1:27017/lms'
];

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'educator', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function connectToMongoDB() {
  console.log('🔌 Attempting to connect to MongoDB...');
  
  for (const uri of possibleUris) {
    if (!uri) continue;
    
    try {
      console.log(`🔄 Trying: ${uri}`);
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000 // 5 second timeout
      });
      console.log('✅ Connected to MongoDB successfully!');
      return uri;
    } catch (error) {
      console.log(`❌ Failed to connect to ${uri}`);
    }
  }
  
  throw new Error('❌ Could not connect to MongoDB with any URI');
}

async function createAdmin() {
  let mongoUri;
  
  try {
    mongoUri = await connectToMongoDB();

    const adminData = {
      name: 'AI Founder Studio Admin',
      email: 'aifounderstudio@gmail.com',
      password: '1234567',
      role: 'admin'
    };

    console.log('\n👤 Creating admin user...');
    console.log('Name:', adminData.name);
    console.log('Email:', adminData.email);
    console.log('Role:', adminData.role);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('\n⚠️ Admin user already exists with this email!');
      console.log('Existing user:', {
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role,
        createdAt: existingAdmin.createdAt
      });
      
      console.log('\n✨ You can login with:');
      console.log('Email: aifounderstudio@gmail.com');
      console.log('Password: 1234567');
      return;
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create the admin user
    const newAdmin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role
    });

    await newAdmin.save();

    console.log('\n🎉 Admin user created successfully!');
    console.log('Admin details:', {
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      createdAt: newAdmin.createdAt
    });

    console.log('\n✨ You can now login with:');
    console.log('Email: aifounderstudio@gmail.com');
    console.log('Password: 1234567');

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    
    if (error.code === 11000) {
      console.log('💡 This email is already registered in the database.');
    }
    
    if (error.message.includes('Could not connect to MongoDB')) {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure MongoDB is running on your system');
      console.log('2. Check if the server is already running (it might have the DB connection)');
      console.log('3. Try running this script while the server is running');
      console.log('4. Or use MongoDB Compass to add the admin manually');
    }
  } finally {
    try {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    } catch (e) {
      // Ignore disconnect errors
    }
    process.exit(0);
  }
}

// Run the script
createAdmin(); 