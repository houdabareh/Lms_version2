const mongoose = require('mongoose');
const Course = require('./models/Course');

async function addTestAIContent() {
  try {
    // Try different MongoDB connection strings
    const possibleUris = [
      process.env.MONGODB_URI,
      'mongodb://localhost:27017/lms',
      'mongodb://127.0.0.1:27017/lms',
      'mongodb+srv://cluster0.mongodb.net/lms' // if using MongoDB Atlas
    ].filter(Boolean);
    
    let mongoUri = possibleUris[0];
    console.log('🔗 Attempting to connect to:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    const courseId = '685a591da1b90e8baadad2f0';
    const course = await Course.findById(courseId);
    
    if (!course) {
      console.log('❌ Course not found');
      return;
    }
    
    console.log('🔍 Found course:', course.title);
    
    // Add AI content to the first lesson of the first section
    if (course.curriculum.length > 0 && course.curriculum[0].lessons.length > 0) {
      const firstLesson = course.curriculum[0].lessons[0];
      
      console.log('📝 Adding AI content to:', firstLesson.title);
      
      // Add AI summary and questions
      firstLesson.summary = "This lesson introduces the fundamentals of data analytics using Pandas, a powerful Python library. Students will learn how to manipulate, analyze, and visualize data effectively. Key concepts include data structures, data cleaning, and basic statistical operations.";
      
      firstLesson.questions = [
        "What are the main data structures in Pandas and how are they used?",
        "How do you handle missing data in a Pandas DataFrame?",
        "What are the key differences between Series and DataFrame objects?"
      ];
      
      await course.save();
      console.log('✅ AI content added successfully!');
      
      // Verify the changes
      const updatedCourse = await Course.findById(courseId);
      const updatedLesson = updatedCourse.curriculum[0].lessons[0];
      
      console.log('\n🔍 Verification:');
      console.log('Summary added:', !!updatedLesson.summary);
      console.log('Questions added:', updatedLesson.questions?.length || 0);
      
      if (updatedLesson.summary) {
        console.log('Summary:', updatedLesson.summary.substring(0, 100) + '...');
      }
      
      if (updatedLesson.questions) {
        updatedLesson.questions.forEach((q, index) => {
          console.log(`Q${index + 1}: ${q}`);
        });
      }
      
    } else {
      console.log('❌ No lessons found to update');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

addTestAIContent(); 