const axios = require('axios');

async function testDetailedFullCourse() {
  try {
    console.log('🧪 Testing Updated AI Full Course Generation (Detailed Content)...');
    
    // Test with a comprehensive topic
    const testData = {
      topicText: 'React.js Web Development: Learn modern front-end development with React, including components, hooks, state management, and building full-stack applications'
    };
    
    console.log('📝 Testing with topic:', testData.topicText);
    
    const response = await axios.post('http://localhost:5000/api/ai/generate-full-course', testData, {
      timeout: 90000 // 90 second timeout for detailed content
    });
    
    console.log('✅ Full course generation successful!');
    console.log('\n📚 Generated Course:');
    console.log('Title:', response.data.title);
    console.log('Description length:', response.data.description?.length || 0, 'characters');
    console.log('Learning outcomes:', response.data.learning_outcomes?.length || 0);
    console.log('Sections:', response.data.sections?.length || 0);
    
    if (response.data.learning_outcomes) {
      console.log('\n🎯 Learning Outcomes:');
      response.data.learning_outcomes.forEach((outcome, index) => {
        console.log(`${index + 1}. ${outcome}`);
      });
    }
    
    if (response.data.sections) {
      console.log('\n📖 Course Sections with Detailed Content:');
      response.data.sections.forEach((section, sIndex) => {
        console.log(`\n===== Section ${sIndex + 1}: ${section.title} =====`);
        if (section.lessons) {
          section.lessons.forEach((lesson, lIndex) => {
            console.log(`\n📝 Lesson ${lIndex + 1}: ${lesson.title}`);
            console.log(`📄 Content length: ${lesson.content?.length || 0} characters`);
            console.log(`❓ Questions: ${lesson.questions?.length || 0}`);
            
            // Show first 200 characters of content
            if (lesson.content) {
              console.log(`📖 Content preview: "${lesson.content.substring(0, 200)}..."`);
            }
            
            // Show questions
            if (lesson.questions && lesson.questions.length > 0) {
              console.log('🧐 Assessment Questions:');
              lesson.questions.forEach((q, qIndex) => {
                console.log(`   ${qIndex + 1}. ${q}`);
              });
            }
          });
        }
      });
    }
    
    console.log('\n📊 Metadata:');
    console.log('Content length:', response.data.metadata?.contentLength);
    console.log('Sections generated:', response.data.metadata?.sectionsGenerated);
    console.log('Total lessons:', response.data.metadata?.totalLessons);
    
    // Validate detailed content
    let totalContentWords = 0;
    let lessonsWithDetailedContent = 0;
    
    if (response.data.sections) {
      response.data.sections.forEach(section => {
        section.lessons?.forEach(lesson => {
          if (lesson.content) {
            const wordCount = lesson.content.split(' ').length;
            totalContentWords += wordCount;
            if (wordCount >= 400) { // Should be 500-800 words
              lessonsWithDetailedContent++;
            }
            console.log(`📊 Lesson "${lesson.title}": ${wordCount} words`);
          }
        });
      });
    }
    
    console.log(`\n✅ Validation Results:`);
    console.log(`Total content words: ${totalContentWords}`);
    console.log(`Lessons with detailed content (400+ words): ${lessonsWithDetailedContent}`);
    console.log(`Average words per lesson: ${Math.round(totalContentWords / (response.data.metadata?.totalLessons || 1))}`);
    
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Check if running directly
if (require.main === module) {
  testDetailedFullCourse();
}

module.exports = { testDetailedFullCourse }; 