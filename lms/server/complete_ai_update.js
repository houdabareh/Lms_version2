const mongoose = require('mongoose');
require('dotenv').config();

async function completeAIUpdate() {
  try {
    const mongoUri = 'mongodb+srv://houdabareh31:wngrZwLlSJSBSdRR@cluster0.obgvxd5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    const Course = require('./models/Course');
    const courseId = '685a591da1b90e8baadad2f0';
    
    // Add AI content to the remaining lessons (lessons 3 and 4 in the array - 0-indexed)
    const updateResult = await Course.updateOne(
      { _id: courseId },
      {
        $set: {
          'curriculum.0.lessons.3.summary': 'This advanced lesson focuses on applying Python and Pandas specifically for marketing data analysis. Students will learn to process customer data, analyze marketing campaign performance, and create meaningful insights for business decision-making. Topics include customer segmentation, conversion analysis, and ROI calculations.',
          'curriculum.0.lessons.3.questions': [
            'How can you segment customers using Pandas for targeted marketing campaigns?',
            'What metrics are essential for measuring marketing campaign effectiveness?',
            'How do you calculate customer lifetime value and retention rates using Python?'
          ],
          'curriculum.0.lessons.4.summary': 'This concluding lesson ties together all the concepts learned throughout the course. Students will understand how to apply data analytics principles to make informed business decisions. The lesson covers best practices, common pitfalls to avoid, and strategies for implementing data-driven approaches in real-world business scenarios.',
          'curriculum.0.lessons.4.questions': [
            'What are the fundamental principles of effective data-driven decision making?',
            'How do you ensure data quality and reliability in your analytical processes?',
            'What are the most common mistakes to avoid when interpreting data analytics results?'
          ]
        }
      }
    );
    
    console.log('✅ Update result:', updateResult);
    
    if (updateResult.modifiedCount > 0) {
      console.log('🎉 Successfully completed AI content for all lessons!');
      
      // Verify the complete update
      const updatedCourse = await Course.findById(courseId);
      console.log('\n🔍 Final Verification:');
      console.log('Course title:', updatedCourse.title);
      
      updatedCourse.curriculum[0].lessons.forEach((lesson, index) => {
        console.log(`\n📝 Lesson ${index + 1}: ${lesson.title}`);
        console.log(`   Summary: ${lesson.summary ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Questions: ${lesson.questions?.length || 0} ✅`);
      });
      
      console.log('\n🎯 ALL LESSONS NOW HAVE AI CONTENT!');
      console.log('🔄 REFRESH YOUR ADMIN PAGE TO SEE ALL THE CHANGES!');
      
    } else {
      console.log('❌ No additional documents were updated.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

completeAIUpdate(); 