const mongoose = require('mongoose');
const Course = require('./models/Course');

async function checkCourseData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/lms');
    console.log('✅ Connected to MongoDB');
    
    const courseId = '685a591da1b90e8baadad2f0';
    const course = await Course.findById(courseId);
    
    if (!course) {
      console.log('❌ Course not found');
      return;
    }
    
    console.log('🔍 Course Title:', course.title);
    console.log('📚 Curriculum sections:', course.curriculum.length);
    
    course.curriculum.forEach((section, sIndex) => {
      console.log(`\n📖 Section ${sIndex + 1}: ${section.title}`);
      console.log(`   Lessons: ${section.lessons.length}`);
      
      section.lessons.forEach((lesson, lIndex) => {
        console.log(`\n   📝 Lesson ${lIndex + 1}: ${lesson.title}`);
        console.log(`      Summary: ${lesson.summary ? 'YES' : 'NO'}`);
        console.log(`      Questions: ${lesson.questions && lesson.questions.length > 0 ? `YES (${lesson.questions.length})` : 'NO'}`);
        console.log(`      Video: ${lesson.videoUrl ? 'YES' : 'NO'}`);
        console.log(`      Material: ${lesson.materialUrl ? 'YES' : 'NO'}`);
        
        if (lesson.summary) {
          console.log(`      Summary content: ${lesson.summary.substring(0, 100)}...`);
        }
        
        if (lesson.questions && lesson.questions.length > 0) {
          lesson.questions.forEach((q, qIndex) => {
            console.log(`        Q${qIndex + 1}: ${q}`);
          });
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

checkCourseData(); 