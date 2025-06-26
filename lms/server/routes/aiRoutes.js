const express = require('express');
const router = express.Router();
const axios = require('axios');
const pdf = require('pdf-parse');
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai/generate-lessons
router.post('/generate-lessons', async (req, res) => {
  try {
    const { pdfUrl } = req.body;

    // Validate input
    if (!pdfUrl) {
      return res.status(400).json({
        success: false,
        error: 'PDF URL is required'
      });
    }

    console.log('🤖 Starting lesson generation for PDF:', pdfUrl);

    // Step 1: Download PDF from Supabase
    let pdfBuffer;
    try {
      const response = await axios.get(pdfUrl, {
        responseType: 'arraybuffer',
        timeout: 30000, // 30 second timeout
      });
      pdfBuffer = Buffer.from(response.data);
      console.log('✅ PDF downloaded successfully, size:', pdfBuffer.length, 'bytes');
    } catch (downloadError) {
      console.error('❌ Error downloading PDF:', downloadError.message);
      return res.status(400).json({
        success: false,
        error: 'Failed to download PDF file',
        details: downloadError.message
      });
    }

    // Step 2: Extract text from PDF
    let extractedText;
    try {
      const pdfData = await pdf(pdfBuffer);
      extractedText = pdfData.text;
      
      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No text content found in PDF'
        });
      }

      console.log('✅ Text extracted successfully, length:', extractedText.length, 'characters');
      console.log('📄 First 200 characters:', extractedText.substring(0, 200));
    } catch (parseError) {
      console.error('❌ Error parsing PDF:', parseError.message);
      return res.status(400).json({
        success: false,
        error: 'Failed to parse PDF content',
        details: parseError.message
      });
    }

    // Step 3: Generate lessons using OpenAI
    try {
        const prompt = `You are an expert educational content designer. Carefully analyze the following course material and transform it into 3 to 5 **comprehensive, in-depth lessons** suitable for student learning.

        For each lesson, generate:
        1. **A descriptive, student-friendly lesson title**
        2. **A well-explained lesson summary**: Teach the topic in simple, engaging language. Include key concepts, definitions, examples, and brief explanations (like a teacher would do in class).
        3. **3 thought-provoking questions** to assess understanding (avoid simple recall; aim for comprehension or application-level questions).
        
        Use this EXACT JSON structure for your response (do not add any extra text before or after):
        [
          {
            "title": "Lesson Title",
            "summary": "In-depth explanation of the topic, covering core concepts, ideas, examples, and clarity for a student audience.",
            "questions": [
              "Question 1?",
              "Question 2?",
              "Question 3?"
            ]
          }
        ]
        
        Analyze this course content carefully and extract educational value:
        
        ${extractedText.substring(0, 8000)}`; // Limit to first 8000 characters to stay within token limits

      console.log('🧠 Sending request to OpenAI...');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0].message.content;
      console.log('✅ OpenAI response received:', aiResponse.substring(0, 200));

      // Parse the AI response
      let lessons;
      try {
        console.log('🔍 Raw AI response:', aiResponse);
        
        // Clean up the response - remove markdown code blocks if present
        let cleanedResponse = aiResponse.trim();
        cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '');
        cleanedResponse = cleanedResponse.replace(/```\s*|\s*```/g, '');
        
        // Extract JSON from the response (in case AI adds extra text)
        const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          lessons = JSON.parse(jsonMatch[0]);
        } else {
          lessons = JSON.parse(cleanedResponse);
        }

        // Validate the structure
        if (!Array.isArray(lessons) || lessons.length === 0) {
          throw new Error('Response is not a valid array of lessons');
        }

        // Validate each lesson and provide detailed error info
        lessons.forEach((lesson, index) => {
          const errors = [];
          
          if (!lesson.title || typeof lesson.title !== 'string') {
            errors.push('missing or invalid title');
          }
          
          if (!lesson.summary || typeof lesson.summary !== 'string') {
            errors.push('missing or invalid summary');
          }
          
          if (!Array.isArray(lesson.questions)) {
            errors.push('questions is not an array');
          } else if (lesson.questions.length !== 3) {
            errors.push(`expected 3 questions, got ${lesson.questions.length}`);
          }
          
          if (errors.length > 0) {
            throw new Error(`Lesson ${index + 1} has issues: ${errors.join(', ')}`);
          }
        });

        console.log('✅ Generated', lessons.length, 'lessons successfully');

      } catch (parseError) {
        console.error('❌ Error parsing AI response:', parseError.message);
        console.error('Raw AI response length:', aiResponse.length);
        console.error('Raw AI response preview:', aiResponse.substring(0, 500));
        return res.status(500).json({
          success: false,
          error: 'Failed to parse AI response',
          details: parseError.message,
          rawResponse: aiResponse.substring(0, 500) // First 500 chars for debugging
        });
      }

      // Return successful response
      res.json({
        success: true,
        lessons: lessons,
        metadata: {
          extractedTextLength: extractedText.length,
          lessonsGenerated: lessons.length,
          timestamp: new Date().toISOString()
        }
      });

    } catch (openaiError) {
      console.error('❌ OpenAI API error:', openaiError.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate lessons with AI',
        details: openaiError.message
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error in generate-lessons:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// POST /api/ai/generate-full-course
router.post('/generate-full-course', async (req, res) => {
  try {
    const { pdfUrl, topicText } = req.body;

    // Validate input - either pdfUrl or topicText is required
    if (!pdfUrl && !topicText) {
      return res.status(400).json({
        success: false,
        error: 'Either PDF URL or topic text is required'
      });
    }

    console.log('🤖 Starting full course generation...');
    console.log('PDF URL provided:', !!pdfUrl);
    console.log('Topic text provided:', !!topicText);

    let contentToAnalyze = '';

    // Step 1: Get content from PDF if provided, otherwise use topic text
    if (pdfUrl) {
      console.log('📄 Processing PDF:', pdfUrl);
      
      // Download PDF from Supabase
      let pdfBuffer;
      try {
        const response = await axios.get(pdfUrl, {
          responseType: 'arraybuffer',
          timeout: 30000, // 30 second timeout
        });
        pdfBuffer = Buffer.from(response.data);
        console.log('✅ PDF downloaded successfully, size:', pdfBuffer.length, 'bytes');
      } catch (downloadError) {
        console.error('❌ Error downloading PDF:', downloadError.message);
        return res.status(400).json({
          success: false,
          error: 'Failed to download PDF file',
          details: downloadError.message
        });
      }

      // Extract text from PDF
      try {
        const pdfData = await pdf(pdfBuffer);
        contentToAnalyze = pdfData.text;
        
        if (!contentToAnalyze || contentToAnalyze.trim().length === 0) {
          return res.status(400).json({
            success: false,
            error: 'No text content found in PDF'
          });
        }

        console.log('✅ Text extracted successfully, length:', contentToAnalyze.length, 'characters');
        console.log('📄 First 200 characters:', contentToAnalyze.substring(0, 200));
      } catch (parseError) {
        console.error('❌ Error parsing PDF:', parseError.message);
        return res.status(400).json({
          success: false,
          error: 'Failed to parse PDF content',
          details: parseError.message
        });
      }
    } else {
      // Use provided topic text
      contentToAnalyze = topicText.trim();
      console.log('✅ Using topic text, length:', contentToAnalyze.length, 'characters');
    }

    // Step 2: Generate full course using OpenAI
    try {
      const prompt = `You are an expert course creator helping educators build professional online courses.

Based on the provided topic or source material, generate a complete course with:

- A professional course title
- A clear, compelling course description (for learners and marketing)
- 3 to 5 measurable learning outcomes
- 3 to 5 structured sections, each containing 1 to 4 lessons

For each lesson, include:
- "title": A clear and specific lesson title
- "content": A full, detailed explanation of the lesson (500–800 words). This should:
  - Introduce the topic clearly
  - Explain key concepts step-by-step
  - Include real-world examples or illustrations
  - Use sample code or pseudocode where relevant
  - Use formatting like bullet points or subheadings if appropriate

- "questions": 3 to 5 assessment questions (open-ended or multiple choice)

INPUT:
${contentToAnalyze.substring(0, 8000)}

Return a valid JSON object in the following format:

{
  "title": "Course Title",
  "description": "Professional course description...",
  "learning_outcomes": [
    "Outcome 1",
    "Outcome 2",
    "Outcome 3"
  ],
  "sections": [
    {
      "title": "Section Title",
      "lessons": [
        {
          "title": "Lesson Title",
          "content": "<<< full detailed explanation here >>>",
          "questions": [
            "Question 1?",
            "Question 2?",
            "Question 3?"
          ]
        }
      ]
    }
  ]
}

Only return valid JSON. Do not include markdown formatting or notes outside of the JSON.`;

      console.log('🧠 Sending full course generation request to OpenAI...');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0].message.content;
      console.log('✅ OpenAI response received:', aiResponse.substring(0, 200));

      // Parse the AI response
      let courseData;
      try {
        console.log('🔍 Raw AI response:', aiResponse);
        
        // Clean up the response - remove markdown code blocks if present
        let cleanedResponse = aiResponse.trim();
        cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '');
        cleanedResponse = cleanedResponse.replace(/```\s*|\s*```/g, '');
        
        // Extract JSON from the response (in case AI adds extra text)
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          courseData = JSON.parse(jsonMatch[0]);
        } else {
          courseData = JSON.parse(cleanedResponse);
        }

        // Validate the structure
        if (!courseData.title || !courseData.description || !Array.isArray(courseData.learning_outcomes) || !Array.isArray(courseData.sections)) {
          throw new Error('Response is missing required fields');
        }

        // Validate sections and lessons
        courseData.sections.forEach((section, sIndex) => {
          if (!section.title || !Array.isArray(section.lessons)) {
            throw new Error(`Section ${sIndex + 1} is missing title or lessons array`);
          }
          
          section.lessons.forEach((lesson, lIndex) => {
            const errors = [];
            
            if (!lesson.title || typeof lesson.title !== 'string') {
              errors.push('missing or invalid title');
            }
            
            if (!lesson.content || typeof lesson.content !== 'string') {
              errors.push('missing or invalid content');
            }
            
            if (!Array.isArray(lesson.questions)) {
              errors.push('questions is not an array');
            } else if (lesson.questions.length < 3 || lesson.questions.length > 5) {
              errors.push(`expected 3-5 questions, got ${lesson.questions.length}`);
            }
            
            if (errors.length > 0) {
              throw new Error(`Section ${sIndex + 1}, Lesson ${lIndex + 1} has issues: ${errors.join(', ')}`);
            }
          });
        });

        console.log('✅ Generated full course successfully');
        console.log('Course title:', courseData.title);
        console.log('Learning outcomes:', courseData.learning_outcomes.length);
        console.log('Sections:', courseData.sections.length);

      } catch (parseError) {
        console.error('❌ Error parsing AI response:', parseError.message);
        console.error('Raw AI response length:', aiResponse.length);
        console.error('Raw AI response preview:', aiResponse.substring(0, 500));
        return res.status(500).json({
          success: false,
          error: 'Failed to parse AI response',
          details: parseError.message,
          rawResponse: aiResponse.substring(0, 500) // First 500 chars for debugging
        });
      }

      // Return successful response
      res.json({
        success: true,
        ...courseData,
        metadata: {
          contentLength: contentToAnalyze.length,
          sectionsGenerated: courseData.sections.length,
          totalLessons: courseData.sections.reduce((total, section) => total + section.lessons.length, 0),
          timestamp: new Date().toISOString()
        }
      });

    } catch (openaiError) {
      console.error('❌ OpenAI API error:', openaiError.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate full course with AI',
        details: openaiError.message
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error in generate-full-course:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router; 