const { OpenAI } = require('openai');

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI client initialized');
} else {
  console.log('⚠️ OpenAI API key not found - will use template-based content generation');
}

// Generic AI content templates for common lesson types
const defaultAIContent = {
  // Computer Science related
  "understanding": {
    summary: "This lesson introduces fundamental concepts and core principles that form the foundation of the subject. Students will learn key definitions, historical context, and basic terminology while building a solid understanding of how these concepts apply in real-world scenarios.",
    questions: [
      "What are the key concepts introduced in this lesson and how do they relate to each other?",
      "How can you apply these fundamental principles in practical situations?",
      "What real-world examples demonstrate the importance of these concepts?"
    ]
  },
  "getting started": {
    summary: "This lesson provides a comprehensive introduction for beginners, covering essential setup, basic operations, and fundamental skills needed to begin working with the topic. Students will gain hands-on experience and confidence to proceed with more advanced concepts.",
    questions: [
      "What are the essential first steps when beginning to work with this topic?",
      "How do you set up the necessary environment and tools?",
      "What basic skills should you master before moving to advanced topics?"
    ]
  },
  "exploring": {
    summary: "This lesson dives deeper into advanced concepts and practical applications. Students will explore various techniques, methodologies, and best practices while learning to analyze and manipulate data effectively for meaningful insights.",
    questions: [
      "What advanced techniques are covered in this lesson?",
      "How do you choose the right approach for different scenarios?",
      "What are the best practices for ensuring accurate results?"
    ]
  },
  "applying": {
    summary: "This lesson focuses on practical implementation and real-world applications. Students will learn to translate theoretical knowledge into actionable solutions, understand industry requirements, and develop skills for professional application.",
    questions: [
      "How do you apply theoretical knowledge to solve real-world problems?",
      "What industry standards and requirements should you consider?",
      "What are the key metrics for measuring success in practical applications?"
    ]
  }
};

/**
 * Generate AI content for a lesson based on its title
 * @param {string} lessonTitle - The title of the lesson
 * @param {string} courseTitle - The title of the course for context
 * @returns {Object} - Object with summary and questions
 */
async function generateLessonContent(lessonTitle, courseTitle = '') {
  try {
    console.log(`🤖 Generating AI content for lesson: "${lessonTitle}"`);

    // Check if OpenAI is available
    if (!openai) {
      console.log('⚠️ OpenAI not available, using template-based content');
      return generateTemplateContent(lessonTitle);
    }

    const prompt = `You are an expert educational content designer. Create comprehensive educational content for the following lesson.

Course Context: ${courseTitle}
Lesson Title: ${lessonTitle}

Generate:
1. A detailed lesson summary (2-3 sentences) that explains what students will learn, covering key concepts, practical applications, and learning outcomes.
2. Exactly 3 assessment questions that test comprehension and application (not just recall).

Respond with ONLY a JSON object in this exact format:
{
  "summary": "Detailed explanation of what students will learn...",
  "questions": [
    "Question 1?",
    "Question 2?", 
    "Question 3?"
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Clean and parse response
    let cleanedResponse = aiResponse.trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '');
    
    const content = JSON.parse(cleanedResponse);
    
    // Validate response
    if (!content.summary || !Array.isArray(content.questions) || content.questions.length !== 3) {
      throw new Error('Invalid AI response format');
    }

    console.log(`✅ AI content generated successfully for: ${lessonTitle}`);
    return content;

  } catch (error) {
    console.log(`⚠️ AI generation failed for "${lessonTitle}", using template: ${error.message}`);
    return generateTemplateContent(lessonTitle);
  }
}

/**
 * Generate template-based content when AI is not available
 * @param {string} lessonTitle - The title of the lesson
 * @returns {Object} - Object with summary and questions
 */
function generateTemplateContent(lessonTitle) {
  const titleLower = lessonTitle.toLowerCase();
  
  // Find matching template based on keywords
  let template = null;
  for (const [key, content] of Object.entries(defaultAIContent)) {
    if (titleLower.includes(key)) {
      template = content;
      break;
    }
  }
  
  // Default template if no match
  if (!template) {
    template = {
      summary: `This lesson covers important concepts related to ${lessonTitle}. Students will learn fundamental principles, practical applications, and gain hands-on experience with key techniques and methodologies relevant to the topic.`,
      questions: [
        `What are the main concepts covered in "${lessonTitle}"?`,
        `How can you apply the knowledge from this lesson in practice?`,
        `What are the key takeaways and learning outcomes from this lesson?`
      ]
    };
  }

  console.log(`📋 Template content generated for: ${lessonTitle}`);
  return template;
}

/**
 * Generate AI content for all lessons in a course curriculum
 * @param {Array} curriculum - Array of course sections with lessons
 * @param {string} courseTitle - Title of the course for context
 * @returns {Array} - Updated curriculum with AI content
 */
async function generateCurriculumContent(curriculum, courseTitle = '') {
  if (!curriculum || !Array.isArray(curriculum)) {
    return curriculum;
  }

  console.log(`🎯 Generating AI content for course: ${courseTitle}`);
  let totalLessons = 0;
  let updatedLessons = 0;

  for (let sectionIndex = 0; sectionIndex < curriculum.length; sectionIndex++) {
    const section = curriculum[sectionIndex];
    
    if (!section.lessons || !Array.isArray(section.lessons)) {
      continue;
    }

    console.log(`📖 Processing section: ${section.title}`);
    
    for (let lessonIndex = 0; lessonIndex < section.lessons.length; lessonIndex++) {
      const lesson = section.lessons[lessonIndex];
      totalLessons++;
      
      // Skip if lesson already has AI content
      if (lesson.summary && lesson.questions && lesson.questions.length > 0) {
        console.log(`   ⏭️ Skipping "${lesson.title}" - already has AI content`);
        continue;
      }

      try {
        const aiContent = await generateLessonContent(lesson.title, courseTitle);
        
        // Add AI content to lesson
        curriculum[sectionIndex].lessons[lessonIndex].summary = aiContent.summary;
        curriculum[sectionIndex].lessons[lessonIndex].questions = aiContent.questions;
        
        updatedLessons++;
        console.log(`   ✅ Added AI content to: ${lesson.title}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`   ❌ Failed to generate content for "${lesson.title}":`, error.message);
      }
    }
  }

  console.log(`🎉 AI content generation complete: ${updatedLessons}/${totalLessons} lessons updated`);
  return curriculum;
}

module.exports = {
  generateLessonContent,
  generateCurriculumContent,
  generateTemplateContent
}; 