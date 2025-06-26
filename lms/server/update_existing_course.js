// This script adds AI content to the existing course for testing
// Run this if you want to see AI content in the current course

const mongoose = require('mongoose');
require('dotenv').config();

async function updateExistingCourse() {
  try {
    // Try multiple connection strings since the server is running
    const possibleUris = [
      process.env.MONGODB_URI,
      'mongodb://localhost:27017/lms',
      'mongodb://127.0.0.1:27017/lms'
    ].filter(Boolean);
    
    let connected = false;
    let mongoUri;
    
    for (const uri of possibleUris) {
      try {
        console.log(`🔗 Trying connection: ${uri}`);
        await mongoose.connect(uri, { 
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 5000
        });
        mongoUri = uri;
        connected = true;
        console.log('✅ Connected to MongoDB successfully!');
        break;
      } catch (err) {
        console.log(`❌ Failed to connect to ${uri}`);
        continue;
      }
    }
    
    if (!connected) {
      console.log('❌ Could not connect to MongoDB');
      console.log('💡 Make sure MongoDB is running and accessible');
      console.log('📋 Since your server is running, MongoDB must be accessible');
      console.log('🔧 Alternative: Use MongoDB Compass or CLI to update manually');
      return;
    }
    
    // Import Course model
    const Course = require('./models/Course');
    
    const courseId = '685a591da1b90e8baadad2f0';
    
    // Use MongoDB's updateOne with $set to add AI fields
    const updateResult = await Course.updateOne(
      { _id: courseId },
      {
        $set: {
          'curriculum.0.lessons.0.summary': 'This lesson introduces the fundamentals of data analytics using Pandas, a powerful Python library. Students will learn how to manipulate, analyze, and visualize data effectively using DataFrames and Series. Key concepts include data loading, basic operations, and data inspection techniques.',
          'curriculum.0.lessons.0.questions': [
            'What are the main data structures in Pandas and how are they used?',
            'How do you load data from different file formats into a Pandas DataFrame?',
            'What are the essential methods for data inspection and exploration?'
          ],
          'curriculum.0.lessons.1.summary': 'This lesson focuses on applying Python and Pandas specifically for marketing data analysis. Students will learn to process customer data, analyze marketing campaign performance, and create meaningful insights for business decision-making.',
          'curriculum.0.lessons.1.questions': [
            'How can you segment customers using Pandas for targeted marketing?',
            'What metrics are important for measuring marketing campaign effectiveness?',
            'How do you calculate customer lifetime value using Python?'
          ],
          'curriculum.0.lessons.2.summary': 'This concluding lesson ties together all concepts learned throughout the course. Students will understand how to apply data analytics principles to make informed business decisions.',
          'curriculum.0.lessons.2.questions': [
            'What are the key principles of data-driven decision making?',
            'How do you ensure data quality and reliability in your analysis?',
            'What are common mistakes to avoid when interpreting data results?'
          ]
        }
      }
    );
    
    console.log('✅ Update result:', updateResult);
    
    if (updateResult.modifiedCount > 0) {
      console.log('🎉 Successfully added AI content to course!');
      
      // Verify the update
      const updatedCourse = await Course.findById(courseId);
      console.log('\n🔍 Verification:');
      console.log('Course title:', updatedCourse.title);
      
      updatedCourse.curriculum[0].lessons.forEach((lesson, index) => {
        console.log(`\n📝 Lesson ${index + 1}: ${lesson.title}`);
        console.log(`   Summary: ${lesson.summary ? 'YES (' + lesson.summary.substring(0, 50) + '...)' : 'NO'}`);
        console.log(`   Questions: ${lesson.questions?.length || 0}`);
      });
      
      console.log('\n🎯 NOW REFRESH YOUR ADMIN PAGE TO SEE THE AI CONTENT!');
      
    } else {
      console.log('❌ No documents were updated. Check course ID and database connection.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

updateExistingCourse(); 