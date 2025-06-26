const Course = require('../models/Course');
const { generateCurriculumContent } = require('../utils/aiGenerator');

// Get only approved courses for public access (students)
exports.getApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' })
      .populate('educator', 'name email')
      .sort({ createdAt: -1 });

    // Add frontend-ready flags
    const coursesWithFlags = courses.map(course => ({
      ...course.toObject(),
      canEnroll: true // All approved courses can be enrolled in
    }));

    res.json(coursesWithFlags);
  } catch (error) {
    console.error('Error fetching approved courses:', error);
    res.status(500).json({ message: 'Server error fetching approved courses.' });
  }
};

//get all the courses by id of the educator (includes all statuses for educator dashboard)
exports.getCoursesByEducator = async (req, res) => {
  try {
    const { educator } = req.query;

    if (!educator) {
      return res.status(400).json({ message: 'Educator ID is required.' });
    }

    const courses = await Course.find({ educator }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error fetching courses.' });
  }
};

// create the course with automatic AI content generation
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      learning_outcomes,
      thumbnailUrl,
      price,
      videoPreviewUrl,
      educator,
      curriculum,
    } = req.body;

    console.log('📥 Course creation request received:');
    console.log('Title:', title);
    console.log('Educator:', educator);
    console.log('Curriculum structure:', JSON.stringify(curriculum, null, 2));

    if (!title || !educator || !curriculum || !Array.isArray(curriculum)) {
      return res.status(400).json({ message: 'Missing required fields or invalid curriculum.' });
    }

    console.log('🤖 Starting automatic AI content generation...');
    
    // Automatically generate AI content for all lessons
    const curriculumWithAI = await generateCurriculumContent(curriculum, title);

    console.log('✅ AI content generation completed');

    const newCourse = new Course({
      title,
      description,
      learning_outcomes,
      thumbnailUrl,
      price,
      videoPreviewUrl,
      educator,
      curriculum: curriculumWithAI, // Use curriculum with AI content
    });

    await newCourse.save();

    console.log('💾 Course saved to database with AI content');

    // Log the AI content that was added
    let totalLessonsWithAI = 0;
    curriculumWithAI.forEach((section, sectionIndex) => {
      console.log(`\n📖 Section ${sectionIndex + 1}: ${section.title}`);
      if (section.lessons) {
        section.lessons.forEach((lesson, lessonIndex) => {
          const hasAI = lesson.summary && lesson.questions && lesson.questions.length > 0;
          if (hasAI) totalLessonsWithAI++;
          console.log(`   📝 Lesson ${lessonIndex + 1}: ${lesson.title} - AI Content: ${hasAI ? 'YES' : 'NO'}`);
        });
      }
    });

    console.log(`\n🎉 Course created successfully with AI content for ${totalLessonsWithAI} lessons!`);

    res.status(201).json({ 
      message: 'Course created successfully with AI-generated content.', 
      course: newCourse,
      aiContentGenerated: totalLessonsWithAI
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error creating course.' });
  }
};

// get that one course by id (only approved courses for public access)
exports.getCourseById = async (req, res) => {
    try {
      const course = await Course.findOne({
        _id: req.params.id,
        status: 'approved' // Only return approved courses
      }).populate('educator', 'name email');
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found or not approved.' });
      }
  
      // Add frontend-ready flag
      const courseResponse = {
        ...course.toObject(),
        canEnroll: course.status === 'approved'
      };
  
      res.status(200).json(courseResponse);
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ message: 'Server error fetching course.' });
    }
  };


  //update the course
  exports.updateCourse = async (req, res) => {
    try {
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedCourse) {
        return res.status(404).json({ message: 'Course not found.' });
      }
  
      res.status(200).json({ message: 'Course updated successfully.', course: updatedCourse });
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ message: 'Server error updating course.' });
    }
  };

  //delete the course 
  exports.deleteCourse = async (req, res) => {
    try {
      const deleted = await Course.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Course not found.' });
      }
      res.status(200).json({ message: 'Course deleted successfully.' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Server error deleting course.' });
    }
  };

  // Validate course for payment (prevent payment for non-approved courses)
  exports.validateCourseForPayment = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course || course.status !== 'approved') {
        return res.status(403).json({ message: 'This course is not approved for purchase.' });
      }

      res.status(200).json({
        valid: true,
        course: {
          id: course._id,
          title: course.title,
          price: course.price,
          status: course.status,
          canPurchase: true
        }
      });
    } catch (error) {
      console.error('Error validating course for payment:', error);
      res.status(500).json({ message: 'Server error validating course.' });
    }
  };