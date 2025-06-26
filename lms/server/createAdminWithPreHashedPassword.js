const mongoose = require('mongoose');

// Pre-hashed password for "1234567" using bcrypt with salt rounds 10
const PREHASHED_PASSWORD = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

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

async function createAdminWithPreHashedPassword() {
  try {
    await connectToMongoDB();

    const adminData = {
      name: 'AI Founder Studio Admin',
      email: 'aifounderstudio@gmail.com',
      password: PREHASHED_PASSWORD, // Pre-hashed "1234567"
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

    // Create the admin user with pre-hashed password
    const newAdmin = new User(adminData);
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
      console.log('✨ You can login with:');
      console.log('Email: aifounderstudio@gmail.com');
      console.log('Password: 1234567');
    }
    
    if (error.message.includes('Could not connect to MongoDB')) {
      console.log('\n🔧 Alternative methods:');
      console.log('1. Use MongoDB Compass to add admin manually');
      console.log('2. Copy the pre-hashed data from admin_user_data.json');
      console.log('3. Insert directly into the users collection');
      
      console.log('\n📋 Admin data for manual insertion:');
      console.log(JSON.stringify({
        name: 'AI Founder Studio Admin',
        email: 'aifounderstudio@gmail.com',
        password: PREHASHED_PASSWORD,
        role: 'admin',
        createdAt: new Date()
      }, null, 2));
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
createAdminWithPreHashedPassword(); 