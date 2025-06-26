// Quick fix: Manually add AI content to test the display
// This simulates what would happen if the course had AI-generated content

const sampleAIContent = {
  courseId: '685a591da1b90e8baadad2f0',
  lessons: [
    {
      title: 'Getting Started with Pandas for Data Analytics',
      summary: 'This lesson introduces the fundamentals of data analytics using Pandas, a powerful Python library. Students will learn how to manipulate, analyze, and visualize data effectively using DataFrames and Series. Key concepts include data loading, basic operations, and data inspection techniques.',
      questions: [
        'What are the main data structures in Pandas and how are they used?',
        'How do you load data from different file formats into a Pandas DataFrame?',
        'What are the essential methods for data inspection and exploration?'
      ]
    },
    {
      title: 'Applying Python for Marketing Data Analytics',
      summary: 'This lesson focuses on applying Python and Pandas specifically for marketing data analysis. Students will learn to process customer data, analyze marketing campaign performance, and create meaningful insights for business decision-making. Topics include customer segmentation, conversion analysis, and ROI calculations.',
      questions: [
        'How can you segment customers using Pandas for targeted marketing?',
        'What metrics are important for measuring marketing campaign effectiveness?',
        'How do you calculate customer lifetime value using Python?'
      ]
    },
    {
      title: 'Conclusion: Mastering Fundamentals for Data-Driven Decision Making',
      summary: 'This concluding lesson ties together all the concepts learned throughout the course. Students will understand how to apply data analytics principles to make informed business decisions. The lesson covers best practices, common pitfalls, and strategies for implementing data-driven approaches in real-world scenarios.',
      questions: [
        'What are the key principles of data-driven decision making?',
        'How do you ensure data quality and reliability in your analysis?',
        'What are common mistakes to avoid when interpreting data analytics results?'
      ]
    }
  ]
};

console.log('📋 Sample AI Content for Course:', sampleAIContent.courseId);
console.log('📚 Number of lessons with AI content:', sampleAIContent.lessons.length);

sampleAIContent.lessons.forEach((lesson, index) => {
  console.log(`\n📝 Lesson ${index + 1}: ${lesson.title}`);
  console.log(`   Summary: ${lesson.summary.substring(0, 80)}...`);
  console.log(`   Questions: ${lesson.questions.length} questions`);
  lesson.questions.forEach((q, qIndex) => {
    console.log(`     Q${qIndex + 1}: ${q}`);
  });
});

console.log('\n🔧 To apply this content, run the MongoDB update script or use the admin panel.');

module.exports = sampleAIContent; 