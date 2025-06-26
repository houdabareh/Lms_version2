import React, { useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenIcon,
  DocumentTextIcon,
  UserIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PlayCircleIcon,
  SparklesIcon,
  PlusCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  PlayIcon,
  ClipboardDocumentIcon,
  DocumentArrowUpIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';
import { uploadFile } from '../../utils/supabaseUtils';
// import hat3dIllustration from '../../assets/hat-3d.png'; // Assuming this asset exists
import axios from 'axios';

// User Status Component
const UserStatus = ({ user, refreshUser }) => {
  const handleRefresh = async () => {
    console.log('🔄 Manual user refresh triggered');
    await refreshUser();
  };

  return (
    <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            User Status: {user ? '✅ Logged In' : '❌ Not Logged In'}
          </p>
          {user && (
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {user.name} ({user.email}) - Role: {user.role}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh User
        </button>
      </div>
    </div>
  );
};

const AddCourse = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const aiFileInputRef = useRef(null);

  // Token validation utility
  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Basic JWT structure check
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;
      
      console.log('🔑 Token Validation:');
      console.log('Token expires at:', new Date(payload.exp * 1000));
      console.log('Current time:', new Date());
      console.log('Token expired:', payload.exp < now);
      console.log('User role in token:', payload.role);
      console.log('User ID in token:', payload.id);
      console.log('User email in token:', payload.email);
      console.log('User name in token:', payload.name);
      console.log('Full token payload:', JSON.stringify(payload, null, 2));
      
      return payload.exp > now;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    learning_outcomes: [], // Add learning outcomes field
    instructor: '',
    price: '',
    image: '', // This will hold the URL after upload
    videoPreview: '', // This will hold the URL after upload
    curriculum: [],
    aiSourceFile: null, // For AI lesson generation
    aiTopicText: '', // For AI topic-based generation
  });

  const [errors, setErrors] = useState({});
  const [openSectionIndex, setOpenSectionIndex] = useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [isGeneratingLessons, setIsGeneratingLessons] = useState(false);
  const [uploadingLessons, setUploadingLessons] = useState({}); // Track video upload status per lesson


  // Helper function for file validation
  const validateFileType = (file, type) => {
    if (!file) return true; // No file, no validation needed

    if (type === 'video') {
      return ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type);
    } else if (type === 'material') {
      return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
    } else if (type === 'image') {
      return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
    }
    return false; // Unknown type
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCourseData(prevData => ({
        ...prevData,
        [name]: files[0]
      }));
    } else {
      setCourseData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const addSection = () => {
    setCourseData(prevData => ({
      ...prevData,
      curriculum: [
        ...prevData.curriculum,
        { title: '', lessons: [] },
      ],
    }));
    setOpenSectionIndex(courseData.curriculum.length);
  };

  const removeSection = (sectionIndex) => {
    setCourseData(prevData => ({
      ...prevData,
      curriculum: prevData.curriculum.filter((_, i) => i !== sectionIndex),
    }));
    if (openSectionIndex === sectionIndex) {
      setOpenSectionIndex(null);
    } else if (openSectionIndex > sectionIndex) {
      setOpenSectionIndex(openSectionIndex - 1);
    }
  };

  const handleSectionChange = (sectionIndex, e) => {
    const { name, value } = e.target;
    setCourseData(prevData => {
      const newCurriculum = [...prevData.curriculum];
      newCurriculum[sectionIndex] = { ...newCurriculum[sectionIndex], [name]: value };
      return { ...prevData, curriculum: newCurriculum };
    });
  };

  const openLessonModal = (sectionIndex, lessonIndex = null) => {
    if (lessonIndex !== null) {
      setEditingLesson({
        sectionIndex,
        lessonIndex,
        lessonData: { ...courseData.curriculum[sectionIndex].lessons[lessonIndex] },
      });
    } else {
      setEditingLesson({
        sectionIndex,
        lessonIndex: null,
        lessonData: { title: '', videoFile: null, materialFile: null, duration: '' },
      });
    }
    setIsLessonModalOpen(true);
  };

  const closeLessonModal = () => {
    setIsLessonModalOpen(false);
    setEditingLesson(null);
  };

  const handleLessonModalChange = (e) => {
    const { name, value, files } = e.target;
    setEditingLesson(prev => ({
      ...prev,
      lessonData: {
        ...prev.lessonData,
        [name]: files ? files[0] : value,
      },
    }));
  };

  const saveLesson = async () => {
    setErrors(prevErrors => { 
      const newErrors = { ...prevErrors };
      if (editingLesson.lessonIndex !== null) {
          delete newErrors[`lessonTitle${editingLesson.sectionIndex}-${editingLesson.lessonIndex}`];
          delete newErrors[`lessonFiles${editingLesson.sectionIndex}-${editingLesson.lessonIndex}`];
          delete newErrors[`lessonDuration${editingLesson.sectionIndex}-${editingLesson.lessonIndex}`];
          delete newErrors[`lessonVideoFile${editingLesson.sectionIndex}-${editingLesson.lessonIndex}`];
          delete newErrors[`lessonMaterialFile${editingLesson.sectionIndex}-${editingLesson.lessonIndex}`];
      }
      return newErrors;
    });

    const newErrors = {};
    const { sectionIndex, lessonIndex, lessonData } = editingLesson;

    if (!lessonData.title) {
        newErrors[`lessonTitle${sectionIndex}-${lessonIndex === null ? 'new' : lessonIndex}`] = 'Lesson title is required.';
    }
    
    // File type validation for video and material files
    if (lessonData.videoFile instanceof File && !validateFileType(lessonData.videoFile, 'video')) {
      newErrors[`lessonVideoFile${sectionIndex}-${lessonIndex === null ? 'new' : lessonIndex}`] = 'Invalid video file format. Supported formats: MP4, WebM, QuickTime.';
    }
    if (lessonData.materialFile instanceof File && !validateFileType(lessonData.materialFile, 'material')) {
      newErrors[`lessonMaterialFile${sectionIndex}-${lessonIndex === null ? 'new' : lessonIndex}`] = 'Invalid material file format. Supported formats: PDF, DOC, DOCX.';
    }

    if (!lessonData.videoFile && !lessonData.materialFile) {
        newErrors[`lessonFiles${sectionIndex}-${lessonIndex === null ? 'new' : lessonIndex}`] = 'Either a video or material file is required.';
    }
    if (!lessonData.duration) {
        newErrors[`lessonDuration${sectionIndex}-${lessonIndex === null ? 'new' : lessonIndex}`] = 'Lesson duration is required.';
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
        return;
    }

    // Start upload process
    setIsUploading(true);
    let videoUrl = lessonData.videoFile instanceof File ? null : lessonData.videoFile; // Keep existing URL if not a new file
    let materialUrl = lessonData.materialFile instanceof File ? null : lessonData.materialFile; // Keep existing URL if not a new file

    try {
      if (lessonData.videoFile instanceof File) {
        const videoFormData = new FormData();
        videoFormData.append('file', lessonData.videoFile);
        const videoUploadResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
          method: 'POST',
          body: videoFormData,
        });
        const text = await videoUploadResponse.text();
        console.log('Upload raw response:', text);
        let videoUploadResult;
        try {
          videoUploadResult = JSON.parse(text);
        } catch (e) {
          throw new Error('Invalid JSON response from upload API');
        }
        if (videoUploadResponse.ok && videoUploadResult.url) {
          videoUrl = videoUploadResult.url;
        } else {
          throw new Error(videoUploadResult.error || 'Video upload failed');
        }
      }

      if (lessonData.materialFile instanceof File) {
        const materialFormData = new FormData();
        materialFormData.append('file', lessonData.materialFile);
        const materialUploadResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
          method: 'POST',
          body: materialFormData,
        });
        const materialUploadResult = await materialUploadResponse.json();
        console.log("Material Upload Result:", materialUploadResult);
        if (materialUploadResponse.ok && materialUploadResult.url) {
          materialUrl = materialUploadResult.url;
        } else {
          throw new Error(materialUploadResult.error || 'Material upload failed');
        }
      }
    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      setErrors(prevErrors => ({ 
        ...prevErrors, 
        upload: `File upload failed: ${typeof uploadError.message === 'string' ? uploadError.message : 'Unknown error'}` 
      }));
      setIsUploading(false);
      return;
    }

    setIsUploading(false);

    const updatedLessonData = {
      ...lessonData,
      videoFile: videoUrl, // Now stores URL or null
      materialFile: materialUrl, // Now stores URL or null
    };

    setCourseData(prevData => {
      const newCurriculum = [...prevData.curriculum];
      if (lessonIndex !== null) {
        newCurriculum[sectionIndex].lessons[lessonIndex] = updatedLessonData;
      } else {
        newCurriculum[sectionIndex].lessons.push(updatedLessonData);
      }
      return { ...prevData, curriculum: newCurriculum };
    });
    closeLessonModal();
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    setCourseData(prevData => {
      const newCurriculum = [...prevData.curriculum];
      newCurriculum[sectionIndex].lessons = newCurriculum[sectionIndex].lessons.filter(
        (_, i) => i !== lessonIndex
      );
      return { ...prevData, curriculum: newCurriculum };
    });
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[`lessonTitle${sectionIndex}-${lessonIndex}`];
      delete newErrors[`lessonFiles${sectionIndex}-${lessonIndex}`];
      delete newErrors[`lessonDuration${sectionIndex}-${lessonIndex}`];
      return newErrors;
    });
  };

  // AI Lesson Generator functions
  const handleAIFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prevErrors => ({ 
          ...prevErrors, 
          aiSourceFile: 'Please upload a PDF or DOCX file.' 
        }));
        return;
      }
      
      setCourseData(prevData => ({
        ...prevData,
        aiSourceFile: file
      }));
      setErrors(prevErrors => ({ ...prevErrors, aiSourceFile: '' }));
    }
  };

  const handleGenerateLessonsFromPDF = async () => {
    if (!courseData.aiSourceFile) {
      setErrors(prevErrors => ({ 
        ...prevErrors, 
        aiSourceFile: 'Please upload a file first.' 
      }));
      return;
    }

    setIsGeneratingLessons(true);
    setErrors(prevErrors => ({ ...prevErrors, aiSourceFile: '' }));

    try {
      console.log('🤖 Starting AI lesson generation...');
      
      // Step 1: Upload the PDF to Supabase first
      const formData = new FormData();
      formData.append('file', courseData.aiSourceFile);
      
      const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload PDF file');
      }

      const uploadResult = await uploadResponse.json();
      const pdfUrl = uploadResult.url;
      
      console.log('✅ PDF uploaded to:', pdfUrl);

      // Step 2: Call the AI lesson generation endpoint
      const aiResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ai/generate-lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl }),
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        throw new Error(errorData.error || 'Failed to generate lessons');
      }

      const result = await aiResponse.json();
      console.log('✅ AI generated lessons:', result);

      // Step 3: Convert AI lessons to course curriculum format
      const autoGeneratedSection = {
        title: "Auto-Generated Lessons",
        lessons: result.lessons.map((lesson) => ({
          title: lesson.title,
          summary: lesson.summary, // Lesson generator still uses summary
          questions: lesson.questions,
          videoFile: null,
          materialFile: null,
          duration: ""
        }))
      };

      // Step 4: Update curriculum - replace existing "Auto-Generated Lessons" section if it exists
      setCourseData(prevData => {
        const updatedCurriculum = [...prevData.curriculum];
        
        // Find if "Auto-Generated Lessons" section already exists
        const existingIndex = updatedCurriculum.findIndex(
          section => section.title === "Auto-Generated Lessons"
        );
        
        if (existingIndex !== -1) {
          // Replace existing section
          updatedCurriculum[existingIndex] = autoGeneratedSection;
          console.log('🔄 Replaced existing Auto-Generated Lessons section');
        } else {
          // Add new section
          updatedCurriculum.push(autoGeneratedSection);
          console.log('➕ Added new Auto-Generated Lessons section');
        }
        
        return {
          ...prevData,
          curriculum: updatedCurriculum
        };
      });

      toast.success(`🎉 Successfully generated ${result.lessons.length} lessons from your PDF!`, {
        position: "top-right",
        autoClose: 4000,
      });

      // Clear the AI source file and file input
      setCourseData(prevData => ({
        ...prevData,
        aiSourceFile: null
      }));
      
      // Reset file input
      if (aiFileInputRef.current) {
        aiFileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('❌ Error generating lessons:', error);
      setErrors(prevErrors => ({ 
        ...prevErrors, 
        aiSourceFile: error.message || 'Failed to generate lessons. Please try again.' 
      }));
      
      toast.error('Failed to generate lessons. Please check your file and try again.', {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsGeneratingLessons(false);
    }
  };

  // Video upload function for AI-generated lessons
  const handleVideoUploadForLesson = async (sectionIndex, lessonIndex, file) => {
    // Validate file type and size
    if (!file) return;
    
    // Check file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (.mp4, .webm, or .mov)', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Check file size (200MB limit)
    const maxSize = 200 * 1024 * 1024; // 200MB in bytes
    if (file.size > maxSize) {
      toast.error('Video file size must be less than 200MB', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const lessonKey = `${sectionIndex}-${lessonIndex}`;
    
    try {
      // Set uploading state
      setUploadingLessons(prev => ({
        ...prev,
        [lessonKey]: true
      }));

      // Upload file using Supabase utility
      const result = await uploadFile(file);
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      // Update courseData with the uploaded video URL
      setCourseData(prev => {
        const updatedCurriculum = [...prev.curriculum];
        updatedCurriculum[sectionIndex].lessons[lessonIndex] = {
          ...updatedCurriculum[sectionIndex].lessons[lessonIndex],
          videoFile: result.url
        };
        return {
          ...prev,
          curriculum: updatedCurriculum
        };
      });

      toast.success('Video uploaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });

    } catch (error) {
      console.error('Video upload error:', error);
      toast.error(error.message || 'Failed to upload video. Please try again.', {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      // Clear uploading state
      setUploadingLessons(prev => {
        const updated = { ...prev };
        delete updated[lessonKey];
        return updated;
      });
    }
  };

  // Remove video from AI-generated lesson
  const handleRemoveVideoFromLesson = (sectionIndex, lessonIndex) => {
    setCourseData(prev => {
      const updatedCurriculum = [...prev.curriculum];
      updatedCurriculum[sectionIndex].lessons[lessonIndex] = {
        ...updatedCurriculum[sectionIndex].lessons[lessonIndex],
        videoFile: null
      };
      return {
        ...prev,
        curriculum: updatedCurriculum
      };
    });

    toast.success('Video removed successfully!', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Full Course Generator function
  const handleGenerateFullCourse = async () => {
    if (!courseData.aiSourceFile && !courseData.aiTopicText?.trim()) {
      setErrors(prevErrors => ({ 
        ...prevErrors, 
        aiFullCourse: 'Please upload a file or enter a course topic.' 
      }));
      return;
    }

    setIsGeneratingLessons(true);
    setErrors(prevErrors => ({ ...prevErrors, aiFullCourse: '' }));

    try {
      console.log('🤖 Starting AI full course generation...');
      
      let requestData = {};

      // Step 1: Upload PDF if provided
      if (courseData.aiSourceFile) {
        const formData = new FormData();
        formData.append('file', courseData.aiSourceFile);
        
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload PDF file');
        }

        const uploadResult = await uploadResponse.json();
        requestData.pdfUrl = uploadResult.url;
        
        console.log('✅ PDF uploaded to:', requestData.pdfUrl);
      } else {
        // Use topic text
        requestData.topicText = courseData.aiTopicText.trim();
        console.log('✅ Using topic text:', requestData.topicText);
      }

      // Step 2: Call the AI full course generation endpoint
      const aiResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ai/generate-full-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        throw new Error(errorData.error || 'Failed to generate full course');
      }

      const result = await aiResponse.json();
      console.log('✅ AI generated full course:', result);

      // Step 3: Update all course data with AI results
      setCourseData(prevData => {
        // Transform sections to match current curriculum format
        const transformedCurriculum = result.sections.map((section) => ({
          title: section.title,
          lessons: section.lessons.map((lesson) => ({
            title: lesson.title,
            summary: lesson.content, // Use content from AI response
            questions: lesson.questions,
            videoFile: null,
            materialFile: null,
            duration: ""
          }))
        }));

        return {
          ...prevData,
          title: result.title,
          description: result.description,
          learning_outcomes: result.learning_outcomes,
          curriculum: transformedCurriculum,
          // Clear AI inputs after successful generation
          aiSourceFile: null,
          aiTopicText: ''
        };
      });

      toast.success(`🎉 Successfully generated full course with ${result.sections.length} sections!`, {
        position: "top-right",
        autoClose: 4000,
      });

      // Reset file input
      if (aiFileInputRef.current) {
        aiFileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('❌ Error generating full course:', error);
      setErrors(prevErrors => ({ 
        ...prevErrors, 
        aiFullCourse: error.message || 'Failed to generate full course. Please try again.' 
      }));
      
      toast.error('Failed to generate full course. Please check your input and try again.', {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsGeneratingLessons(false);
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!courseData.title) newErrors.title = 'Course title is required.';
    if (!courseData.description) newErrors.description = 'Description is required.';
    if (!courseData.instructor) newErrors.instructor = 'Instructor name is required.';
    if (!courseData.price) newErrors.price = 'Price is required.';

    // Validate image and videoPreview files
    if (courseData.image instanceof File && !validateFileType(courseData.image, 'image')) {
      newErrors.image = 'Invalid image file format. Supported formats: JPG, PNG, GIF, WebP.';
    }
    if (courseData.videoPreview instanceof File && !validateFileType(courseData.videoPreview, 'video')) {
      newErrors.videoPreview = 'Invalid video preview file format. Supported formats: MP4, WebM, QuickTime.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    console.log("Validating section titles:", courseData.curriculum.map(s => s.title));
    console.log("Curriculum structure:", {
      sectionsCount: courseData.curriculum.length,
      sectionsWithLessons: courseData.curriculum.filter(s => Array.isArray(s.lessons) && s.lessons.length > 0).length,
      aiGeneratedLessons: courseData.curriculum.reduce((acc, section) => 
        acc + (section.lessons?.filter(lesson => lesson.summary || (lesson.questions && lesson.questions.length > 0)).length || 0), 0)
    });
    
    // Basic curriculum structure validation
    const isValid = Array.isArray(courseData.curriculum) &&
      courseData.curriculum.length > 0 &&
      courseData.curriculum.every(section =>
        Array.isArray(section.lessons) && section.lessons.length > 0
      );

    if (!isValid) {
      newErrors.curriculum = 'At least one section with at least one lesson is required.';
    } else {
      courseData.curriculum.forEach((section, sectionIndex) => {
        if (!section.title || section.title.trim() === '') {
          newErrors[`sectionTitle${sectionIndex}`] = `Section ${sectionIndex + 1} title is required.`;
        }
        if (!Array.isArray(section.lessons) || section.lessons.length === 0) {
          newErrors[`sectionLessons${sectionIndex}`] = `Section ${sectionIndex + 1} must have at least one lesson.`;
        } else {
          section.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.title) {
              newErrors[`lessonTitle${sectionIndex}-${lessonIndex}`] = `Lesson ${lessonIndex + 1} in Section ${sectionIndex + 1} title is required.`;
            }
            
            // Check if this is an AI-generated lesson (has summary or questions)
            const isAIGenerated = lesson.summary || (lesson.questions && lesson.questions.length > 0);
            
            if (isAIGenerated) {
              console.log(`🤖 Detected AI-generated lesson: "${lesson.title}" in section "${section.title}"`);
            }
            
            // For non-AI lessons, require files and duration
            if (!isAIGenerated) {
              if (!lesson.videoFile && !lesson.materialFile) {
                newErrors[`lessonFiles${sectionIndex}-${lessonIndex}`] = `Lesson ${lessonIndex + 1} in Section ${sectionIndex + 1} requires either a video or material file.`;
              }
              if (!lesson.duration) {
                newErrors[`lessonDuration${sectionIndex}-${lessonIndex}`] = `Lesson ${lessonIndex + 1} in Section ${sectionIndex + 1} duration is required.`;
              }
            }
            
            // File type validation for uploaded files
            if (lesson.videoFile instanceof File && !validateFileType(lesson.videoFile, 'video')) {
              newErrors[`lessonVideoFile${sectionIndex}-${lessonIndex}`] = 'Invalid video file format.';
            }
            if (lesson.materialFile instanceof File && !validateFileType(lesson.materialFile, 'material')) {
              newErrors[`lessonMaterialFile${sectionIndex}-${lessonIndex}`] = 'Invalid material file format.';
            }
          });
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    let isValid = true;
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep1() && validateStep2()) {
      setIsSubmittingCourse(true); // Indicate submission start
      let imageUrl = courseData.image instanceof File ? null : courseData.image; // Initialize with existing URL if not a new file
      let videoPreviewUrl = courseData.videoPreview instanceof File ? null : courseData.videoPreview; // Initialize with existing URL if not a new file

      try {
        // Upload image if it's a new file
        if (courseData.image instanceof File) {
          const imageFormData = new FormData();
          imageFormData.append('file', courseData.image);
          const imageUploadResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
            method: 'POST',
            body: imageFormData,
          });
          const text = await imageUploadResponse.text();
          let imageUploadResult;
          try {
            imageUploadResult = JSON.parse(text);
          } catch (e) {
            throw new Error('Invalid JSON response from image upload API');
          }
          if (imageUploadResponse.ok && imageUploadResult.url) {
            imageUrl = imageUploadResult.url;
            setCourseData(prevData => ({ ...prevData, image: imageUrl })); // Update state with URL
          } else {
            throw new Error(imageUploadResult.error || 'Image upload failed');
          }
        }

        // Upload video preview if it's a new file
        if (courseData.videoPreview instanceof File) {
          const videoPreviewFormData = new FormData();
          videoPreviewFormData.append('file', courseData.videoPreview);
          const videoPreviewUploadResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
            method: 'POST',
            body: videoPreviewFormData,
          });
          const videoPreviewUploadResult = await videoPreviewUploadResponse.json();
          console.log("Video Preview Upload Result:", videoPreviewUploadResult);
          if (videoPreviewUploadResponse.ok && videoPreviewUploadResult.url) {
            videoPreviewUrl = videoPreviewUploadResult.url;
            setCourseData(prevData => ({ ...prevData, videoPreview: videoPreviewUrl })); // Update state with URL
          } else {
            throw new Error(videoPreviewUploadResult.error || 'Video preview upload failed');
          }
        }

        setIsUploading(true);

        // Debug token and user info
        const token = localStorage.getItem('token');
        
        // Initialize currentUser first
        let currentUser = user;
        
        console.log('🔍 Debug Info:');
        console.log('Token exists:', !!token);
        console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
        console.log('Initial User object:', user);
        console.log('Initial User ID:', user?._id);
        console.log('Initial User role:', user?.role);
        console.log('Current User ID:', currentUser?._id);
        console.log('Current User role:', currentUser?.role);

        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        if (!validateToken()) {
          throw new Error('Your session has expired. Please log in again.');
        }

        // Try to refresh user data if it's missing
        if (!currentUser?._id) {
          console.log('🔄 User data missing, attempting to refresh...');
          currentUser = await refreshUser();
          
          if (!currentUser?._id) {
            throw new Error('User information not available. Please log out and log back in.');
          }
        }

        if (currentUser?.role !== 'educator' && currentUser?.role !== 'admin') {
          throw new Error(`You must be an educator to create courses. Your role: ${currentUser?.role}`);
        }

        const finalCourseData = {
          title: courseData.title,
          description: courseData.description,
          learning_outcomes: courseData.learning_outcomes, // Include learning outcomes
          thumbnailUrl: imageUrl,
          price: parseFloat(courseData.price) || 0,
          videoPreviewUrl: videoPreviewUrl,
          educator: currentUser._id, // Use the validated currentUser
          curriculum: courseData.curriculum.map(section => ({
            ...section,
            lessons: section.lessons.map(lesson => ({
              title: lesson.title,
              duration: lesson.duration,
              summary: lesson.summary, // Include AI-generated summary
              questions: lesson.questions, // Include AI-generated questions
              videoUrl: lesson.videoFile instanceof File ? null : lesson.videoFile, // Map videoFile to videoUrl
              materialUrl: lesson.materialFile instanceof File ? null : lesson.materialFile, // Map materialFile to materialUrl
            }))
          })),
        };

        console.log('📤 Sending to backend:');
        console.log('Title:', finalCourseData.title);
        console.log('Educator ID:', finalCourseData.educator);
        console.log('Price:', finalCourseData.price);
        console.log('Curriculum Length:', finalCourseData.curriculum.length);
        console.log('Curriculum is Array:', Array.isArray(finalCourseData.curriculum));
        console.log('Full curriculum structure:', JSON.stringify(finalCourseData.curriculum, null, 2));

        // Test manual token decode before sending
        try {
          const tokenParts = token.split('.');
          const tokenPayload = JSON.parse(atob(tokenParts[1]));
          console.log('🔍 Manual Token Check Before Request:');
          console.log('Role in token:', tokenPayload.role);
          console.log('Expected roles:', ['educator', 'admin']);
          console.log('Role matches expected:', ['educator', 'admin'].includes(tokenPayload.role));
          console.log('Token ID:', tokenPayload.id);
          console.log('Matches current user ID:', tokenPayload.id === currentUser._id);
        } catch (e) {
          console.error('❌ Failed to decode token manually:', e);
        }

        // Send to backend
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const requestHeaders = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        
        console.log('🌐 Final Request Details:');
        console.log('URL:', `${apiUrl}/api/courses`);
        console.log('Headers:', requestHeaders);
        console.log('Request Body Keys:', Object.keys(finalCourseData));
        
        const res = await axios.post(`${apiUrl}/api/courses`, finalCourseData, {
          headers: requestHeaders
        });

        const data = await res.data;
        console.log('✅ Course created on server:', data);
        toast.success('🎉 Course submitted successfully. Await admin approval.', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCourseData({
          title: '',
          description: '',
          instructor: '',
          price: '',
          image: imageUrl,
          videoPreview: videoPreviewUrl,
          curriculum: [],
        });
        setCurrentStep(1);
      } catch (submitError) {
        console.error('❌ Submission failed:', submitError);
        
        let errorMessage = 'Something went wrong while saving your course.';
        
        if (submitError.response) {
          // Server responded with error status
          const status = submitError.response.status;
          const errorData = submitError.response.data;
          
          console.log('🚨 Server Error Details:');
          console.log('Status:', status);
          console.log('Error Data:', errorData);
          console.log('Full Error Object:', JSON.stringify(errorData, null, 2));
          console.log('Error Message:', errorData.message);
          console.log('User Role from Error:', errorData.userRole);
          console.log('Required Roles:', errorData.requiredRoles);
          
          if (status === 403) {
            errorMessage = `Access denied: ${errorData.message || 'You don\'t have permission to create courses. Please check your account role.'}`;
          } else if (status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
          } else if (status === 400) {
            errorMessage = `Invalid data: ${errorData.message || 'Please check your form data.'}`;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else if (submitError.message) {
          errorMessage = submitError.message;
        }
        
        toast.error(errorMessage, {
          position: 'top-center',
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsSubmittingCourse(false); // End submission loading
        setIsUploading(false);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const inputFocusVariants = {
    focus: { scale: 1.01, borderColor: '#6366F1', boxShadow: 'none' },
    blur: { scale: 1, borderColor: '#D1D5DB', boxShadow: 'none' },
  };

  const stepTransitionVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    }),
  };

  const accordionVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.4, ease: "easeOut" } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.4, ease: "easeIn" } },
  };

  const shimmerEffect = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="title" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2 flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2 text-primary dark:text-accent" /> Course Title:
              </label>
              <motion.input
                type="text"
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-300 dark:bg-gray-700 ${errors.title ? 'ring-red-500' : ''} text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary transition-all duration-300`}
                placeholder="e.g., Introduction to React"
                required
                whileFocus="focus"
                onBlur={() => setErrors(prevErrors => ({ ...prevErrors, title: courseData.title ? '' : 'Course title is required.' }))}
                variants={inputFocusVariants}
              />
              {errors.title && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.title}</motion.p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="description" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-primary dark:text-accent" /> Description:
              </label>
              <motion.textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                rows="5"
                className={`w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-300 dark:bg-gray-700 ${errors.description ? 'ring-red-500' : ''} text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary transition-all duration-300`}
                placeholder="Provide a detailed description of the course."
                required
                whileFocus="focus"
                onBlur={() => setErrors(prevErrors => ({ ...prevErrors, description: courseData.description ? '' : 'Description is required.' }))}
                variants={inputFocusVariants}
              ></motion.textarea>
              {errors.description && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.description}</motion.p>}
            </motion.div>

            {/* Learning Outcomes Display */}
            {courseData.learning_outcomes && courseData.learning_outcomes.length > 0 && (
              <motion.div variants={itemVariants} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  What You'll Learn
                </h3>
                <ul className="space-y-2">
                  {courseData.learning_outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start text-blue-800 dark:text-blue-200">
                      <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label htmlFor="instructor" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-primary dark:text-accent" /> Instructor Name:
              </label>
              <motion.input
                type="text"
                id="instructor"
                name="instructor"
                value={courseData.instructor}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-300 dark:bg-gray-700 ${errors.instructor ? 'ring-red-500' : ''} text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary transition-all duration-300`}
                placeholder="e.g., Jane Doe"
                required
                whileFocus="focus"
                onBlur={() => setErrors(prevErrors => ({ ...prevErrors, instructor: courseData.instructor ? '' : 'Instructor name is required.' }))}
                variants={inputFocusVariants}
              />
              {errors.instructor && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.instructor}</motion.p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="price" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-primary dark:text-accent" /> Price ($):
              </label>
              <motion.input
                type="number"
                id="price"
                name="price"
                value={courseData.price}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-300 dark:bg-gray-700 ${errors.price ? 'ring-red-500' : ''} text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary transition-all duration-300`}
                placeholder="e.g., 49.99"
                step="0.01"
                required
                whileFocus="focus"
                onBlur={() => setErrors(prevErrors => ({ ...prevErrors, price: courseData.price ? '' : 'Price is required.' }))}
                variants={inputFocusVariants}
              />
              {errors.price && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.price}</motion.p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="image" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2 flex items-center">
                <PhotoIcon className="h-5 w-5 mr-2 text-primary dark:text-accent" /> Course Thumbnail (Image File):
              </label>
              <motion.input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className={`w-full text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${errors.image ? 'border-red-500' : ''}`}
                whileFocus="focus"
                variants={inputFocusVariants}
              />
              {errors.image && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{typeof errors.image === 'string' ? errors.image : 'Invalid image'}</motion.p>}
              {courseData.image instanceof File && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Selected file: {courseData.image.name}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="videoPreview" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2 flex items-center">
                <PlayCircleIcon className="h-5 w-5 mr-2 text-primary dark:text-accent" /> Video Preview (Video File):
              </label>
              <motion.input
                type="file"
                id="videoPreview"
                name="videoPreview"
                accept="video/*"
                onChange={handleChange}
                className={`w-full text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${errors.videoPreview ? 'border-red-500' : ''}`}
                whileFocus="focus"
                variants={inputFocusVariants}
              />
              {errors.videoPreview && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{typeof errors.videoPreview === 'string' ? errors.videoPreview : 'Invalid video preview'}</motion.p>}
              {courseData.videoPreview instanceof File && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Selected file: {courseData.videoPreview.name}</p>
              )}
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            variants={stepTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={-1}
            className="space-y-6 mt-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-inner ring-1 ring-gray-200 dark:ring-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center mb-4">
              <BookOpenIcon className="h-7 w-7 mr-2 text-primary dark:text-accent" /> Course Curriculum
            </h2>
            {errors.curriculum && <motion.p className="text-red-500 text-sm mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.curriculum}</motion.p>}

            <AnimatePresence mode="popLayout">
              {courseData.curriculum.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md mb-4 last:mb-0"
                >
                  <motion.button
                    type="button"
                    onClick={() => setOpenSectionIndex(openSectionIndex === sectionIndex ? null : sectionIndex)}
                    className="flex items-center justify-between w-full p-5 text-left text-lg font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-t-xl"
                  >
                    <span>Section {sectionIndex + 1}: {section.title || 'New Section'} ({section.lessons.length} lessons)</span>
                    <motion.div
                      animate={{ rotate: openSectionIndex === sectionIndex ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDownIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </motion.div>
                  </motion.button>
                  {/* Move this error inside the expanded section content */}
                  {/* {errors[`sectionTitle${sectionIndex}`] && openSectionIndex !== sectionIndex && <motion.p className="text-red-500 text-sm px-5 pb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[`sectionTitle${sectionIndex}`]}</motion.p>} */}

                  <AnimatePresence>
                    {openSectionIndex === sectionIndex && (
                      <motion.div
                        variants={accordionVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="p-5 border-t border-gray-300 dark:border-gray-700 space-y-3"
                      >
                        {/* Section Title Input */}
                        <div>
                          <label htmlFor={`sectionTitle-${sectionIndex}`} className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2">Section Title:</label>
                          <input
                            type="text"
                            id={`sectionTitle-${sectionIndex}`}
                            name="title"
                            placeholder={`Section ${sectionIndex + 1} Title`}
                            value={section.title}
                            onChange={(e) => handleSectionChange(sectionIndex, e)}
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 ring-1 ring-gray-200 dark:bg-gray-700 ${errors[`sectionTitle${sectionIndex}`] ? 'ring-red-500' : ''} text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary transition-all duration-300 font-semibold text-lg`}
                            required
                          />
                          {errors[`sectionTitle${sectionIndex}`] && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[`sectionTitle${sectionIndex}`]}</motion.p>}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Lessons:</h3>
                        {errors[`sectionLessons${sectionIndex}`] && <motion.p className="text-red-500 text-sm mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[`sectionLessons${sectionIndex}`]}</motion.p>}

                        <AnimatePresence mode="popLayout">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <motion.div
                              key={lessonIndex}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm text-gray-800 dark:text-gray-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center flex-grow">
                                  {lesson.videoFile ? (
                                    <PlayIcon className="h-5 w-5 mr-3 text-primary dark:text-accent" />
                                  ) : lesson.summary ? (
                                    <SparklesIcon className="h-5 w-5 mr-3 text-purple-500 dark:text-purple-400" />
                                  ) : (
                                    <ClipboardDocumentIcon className="h-5 w-5 mr-3 text-primary dark:text-accent" />
                                  )}
                                  <span className="font-medium text-base">Lesson {lessonIndex + 1}: {lesson.title || 'New Lesson'}</span>
                                  {lesson.duration && <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">{lesson.duration}</span>}
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                  <motion.button
                                    type="button"
                                    onClick={() => openLessonModal(sectionIndex, lessonIndex)}
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    Edit
                                  </motion.button>
                                  <motion.button
                                    type="button"
                                    onClick={() => removeLesson(sectionIndex, lessonIndex)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    Delete
                                  </motion.button>
                                </div>
                              </div>
                              
                              {/* AI-Generated Content Display */}
                              {lesson.summary && (
                                <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                                  <p className="text-sm text-purple-800 dark:text-purple-200 font-medium mb-1">AI Summary:</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{lesson.summary}</p>
                                </div>
                              )}
                              
                              {lesson.questions && lesson.questions.length > 0 && (
                                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">Assessment Questions:</p>
                                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    {lesson.questions.map((question, qIndex) => (
                                      <li key={qIndex} className="flex items-start">
                                        <span className="text-blue-600 dark:text-blue-400 mr-2 font-medium">{qIndex + 1}.</span>
                                        <span>{question}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Video Upload for AI-Generated Lessons */}
                              {(lesson.summary || (lesson.questions && lesson.questions.length > 0)) && 
                                section.title === "Auto-Generated Lessons" && (
                                <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-green-800 dark:text-green-200 font-medium flex items-center">
                                      <VideoCameraIcon className="h-4 w-4 mr-2" />
                                      🎥 Upload Video
                                    </p>
                                  </div>
                                  
                                  {lesson.videoFile ? (
                                    // Show uploaded video status
                                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                                      <div className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                          {typeof lesson.videoFile === 'string' 
                                            ? lesson.videoFile.split('/').pop().substring(0, 30) + (lesson.videoFile.split('/').pop().length > 30 ? '...' : '')
                                            : 'Video uploaded'
                                          }
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <motion.label
                                          htmlFor={`video-replace-${sectionIndex}-${lessonIndex}`}
                                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded cursor-pointer transition-colors"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          Replace
                                        </motion.label>
                                        <input
                                          id={`video-replace-${sectionIndex}-${lessonIndex}`}
                                          type="file"
                                          accept=".mp4,.webm,.mov"
                                          onChange={(e) => handleVideoUploadForLesson(sectionIndex, lessonIndex, e.target.files[0])}
                                          className="hidden"
                                        />
                                        <motion.button
                                          type="button"
                                          onClick={() => handleRemoveVideoFromLesson(sectionIndex, lessonIndex)}
                                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <TrashIcon className="h-3 w-3" />
                                        </motion.button>
                                      </div>
                                    </div>
                                  ) : (
                                    // Show upload interface
                                    <div>
                                      {uploadingLessons[`${sectionIndex}-${lessonIndex}`] ? (
                                        <div className="flex items-center justify-center p-3 bg-white dark:bg-gray-700 rounded border border-dashed border-green-300 dark:border-green-600">
                                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mr-2"></div>
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Uploading video...</span>
                                        </div>
                                      ) : (
                                        <motion.label
                                          htmlFor={`video-upload-${sectionIndex}-${lessonIndex}`}
                                          className="flex items-center justify-center p-3 bg-white dark:bg-gray-700 rounded border border-dashed border-green-300 dark:border-green-600 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          <VideoCameraIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                                          <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                                            Click to upload video (.mp4, .webm, .mov)
                                          </span>
                                        </motion.label>
                                      )}
                                      <input
                                        id={`video-upload-${sectionIndex}-${lessonIndex}`}
                                        type="file"
                                        accept=".mp4,.webm,.mov"
                                        onChange={(e) => handleVideoUploadForLesson(sectionIndex, lessonIndex, e.target.files[0])}
                                        className="hidden"
                                      />
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                                        Max file size: 200MB
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        <motion.button
                          type="button"
                          onClick={() => openLessonModal(sectionIndex)}
                          className="mt-4 w-full px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 transition-colors duration-200 flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <PlusCircleIcon className="h-5 w-5 mr-2" /> Add Lesson
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* AI Full Course Generator Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-purple-200 dark:border-purple-800 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 mb-6"
            >
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 flex items-center mb-4">
                <SparklesIcon className="h-6 w-6 mr-2" />
                AI Full Course Generator
              </h3>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                Upload a PDF/DOCX file or enter a course topic to automatically generate a complete course with title, description, learning outcomes, and curriculum.
              </p>

              <div className="space-y-4">
                {/* Topic Text Input */}
                <div>
                  <label htmlFor="aiTopicText" className="block text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2 flex items-center">
                    <BookOpenIcon className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Course Topic (Option 1)
                  </label>
                  <motion.textarea
                    id="aiTopicText"
                    name="aiTopicText"
                    value={courseData.aiTopicText}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-purple-300 dark:bg-gray-700 dark:ring-purple-600 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-purple-500 transition-all duration-300"
                    placeholder="e.g., Introduction to Data Science, Web Development with React, Digital Marketing Fundamentals..."
                    whileFocus="focus"
                    variants={inputFocusVariants}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Describe the course topic, target audience, or key concepts you want to cover
                  </p>
                </div>

                {/* OR Divider */}
                <div className="flex items-center">
                  <div className="flex-grow border-t border-purple-300 dark:border-purple-600"></div>
                  <span className="mx-4 text-purple-600 dark:text-purple-400 font-medium text-sm">OR</span>
                  <div className="flex-grow border-t border-purple-300 dark:border-purple-600"></div>
                </div>

                {/* File Upload */}
                <div>
                  <label htmlFor="aiSourceFile" className="block text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2 flex items-center">
                    <DocumentArrowUpIcon className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Upload Course Material (Option 2)
                  </label>
                  <input
                    ref={aiFileInputRef}
                    type="file"
                    id="aiSourceFile"
                    accept=".pdf,.docx"
                    onChange={handleAIFileUpload}
                    className="w-full text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 border border-purple-300 dark:border-purple-600 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  />
                  {errors.aiSourceFile && (
                    <motion.p 
                      className="text-red-500 text-sm mt-1" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                    >
                      {errors.aiSourceFile}
                    </motion.p>
                  )}
                  {courseData.aiSourceFile && (
                    <motion.p 
                      className="text-purple-700 dark:text-purple-300 text-sm mt-1 flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      Selected: {courseData.aiSourceFile.name}
                    </motion.p>
                  )}
                </div>

                {/* Error display for full course generation */}
                {errors.aiFullCourse && (
                  <motion.p 
                    className="text-red-500 text-sm" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                  >
                    {errors.aiFullCourse}
                  </motion.p>
                )}

                {/* Generate Full Course Button */}
                <motion.button
                  type="button"
                  onClick={handleGenerateFullCourse}
                  disabled={(!courseData.aiSourceFile && !courseData.aiTopicText?.trim()) || isGeneratingLessons}
                  className={`w-full px-6 py-3 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
                    (courseData.aiSourceFile || courseData.aiTopicText?.trim()) && !isGeneratingLessons
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={{ scale: (courseData.aiSourceFile || courseData.aiTopicText?.trim()) && !isGeneratingLessons ? 1.02 : 1 }}
                  whileTap={{ scale: (courseData.aiSourceFile || courseData.aiTopicText?.trim()) && !isGeneratingLessons ? 0.98 : 1 }}
                >
                  {isGeneratingLessons ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Full Course...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      🚀 Generate Full Course with AI
                    </>
                  )}
                </motion.button>

                {/* Generate Lessons Only Button (Keep existing functionality) */}
                <motion.button
                  type="button"
                  onClick={handleGenerateLessonsFromPDF}
                  disabled={!courseData.aiSourceFile || isGeneratingLessons}
                  className={`w-full px-6 py-3 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
                    courseData.aiSourceFile && !isGeneratingLessons
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={{ scale: courseData.aiSourceFile && !isGeneratingLessons ? 1.02 : 1 }}
                  whileTap={{ scale: courseData.aiSourceFile && !isGeneratingLessons ? 0.98 : 1 }}
                >
                  {isGeneratingLessons ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Lessons...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Generate Lessons Only (from PDF)
                    </>
                  )}
                </motion.button>

                <div className="text-xs text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <strong>✨ Full Course Generation:</strong> Creates complete course structure including title, description, learning outcomes, and curriculum sections.<br/>
                  <strong>📝 Lessons Only:</strong> Adds AI-generated lessons to your existing curriculum.
                </div>
              </div>
            </motion.div>

            {/* OR Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="mx-4 text-gray-500 dark:text-gray-400 font-medium text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <motion.button
              type="button"
              onClick={addSection}
              className="w-full px-6 py-3 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusCircleIcon className="h-6 w-6 mr-3" /> Add Section Manually
            </motion.button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            variants={stepTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center flex items-center justify-center">
              <SparklesIcon className="h-7 w-7 mr-2 text-primary dark:text-accent" /> Review Your Course
            </h2>
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-inner space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Course Information</h3>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Title:</span> {courseData.title}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Description:</span> {courseData.description}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Instructor:</span> {courseData.instructor}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Price:</span> ${courseData.price}</p>

              {/* Learning Outcomes Review */}
              {courseData.learning_outcomes && courseData.learning_outcomes.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Learning Outcomes:</h4>
                  <ul className="space-y-1 ml-4">
                    {courseData.learning_outcomes.map((outcome, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                        <CheckCircleIcon className="h-4 w-4 mr-2 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {courseData.image && <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Image:</span> {courseData.image instanceof File ? courseData.image.name : (typeof courseData.image === 'string' ? courseData.image : '')}</p>}
              {courseData.videoPreview && <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Video Preview:</span> {courseData.videoPreview instanceof File ? courseData.videoPreview.name : (typeof courseData.videoPreview === 'string' ? courseData.videoPreview : 'Invalid file')}</p>}
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-inner space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Curriculum ({courseData.curriculum.length} Sections)</h3>
              {courseData.curriculum.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No curriculum sections added.</p>
              ) : (
                <ul className="space-y-4">
                  {courseData.curriculum.map((section, sectionIndex) => (
                    <li key={sectionIndex} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Section {sectionIndex + 1}: {section.title}</p>
                      <ul className="ml-4 mt-2 space-y-2">
                        {section.lessons.length === 0 ? (
                          <p className="text-gray-600 dark:text-gray-400">No lessons in this section.</p>
                        ) : (
                          section.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="text-gray-700 dark:text-gray-300 border-l-2 border-primary pl-3 space-y-2">
                              <div className="flex items-center">
                                {lesson.summary ? (
                                  <SparklesIcon className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                                ) : null}
                                <p className="font-medium">Lesson {lessonIndex + 1}: {lesson.title}</p>
                              </div>
                              {lesson.duration && <p className="text-sm">Duration: {lesson.duration}</p>}
                              {lesson.summary && (
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded border border-purple-200 dark:border-purple-800">
                                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">AI Summary:</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.summary}</p>
                                </div>
                              )}
                              {lesson.questions && lesson.questions.length > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Assessment Questions:</p>
                                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    {lesson.questions.slice(0, 2).map((question, qIndex) => (
                                      <li key={qIndex} className="flex items-start">
                                        <span className="text-blue-600 dark:text-blue-400 mr-1 font-medium">{qIndex + 1}.</span>
                                        <span>{question}</span>
                                      </li>
                                    ))}
                                    {lesson.questions.length > 2 && (
                                      <li className="text-blue-600 dark:text-blue-400 text-xs italic">
                                        +{lesson.questions.length - 2} more questions...
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                              {lesson.videoFile && (
                                <p className="text-sm">
                                  Video: {lesson.videoFile instanceof File
                                    ? lesson.videoFile.name
                                    : typeof lesson.videoFile === 'string'
                                      ? lesson.videoFile.split('/').pop() // Show just filename for URLs
                                      : ''}
                                </p>
                              )}
                              {lesson.materialFile && (
                                <p className="text-sm">
                                  Material: {lesson.materialFile instanceof File
                                    ? lesson.materialFile.name
                                    : typeof lesson.materialFile === 'string'
                                      ? lesson.materialFile.split('/').pop() // Show just filename for URLs
                                      : ''}
                                </p>
                              )}
                            </li>
                          ))
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] relative flex items-center justify-center py-10 bg-gray-50 dark:bg-darkBg overflow-hidden">
      {/* Soft radial or gradient background inspired by GFS LMS logo colors */}
      
      <motion.div
        className={`relative z-10 w-full max-w-5xl mx-auto flex flex-col rounded-3xl shadow-2xl bg-white dark:bg-gray-800 p-8 ${shimmerEffect}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Progress Indicator */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Step {currentStep} of 3
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </motion.div>

        {/* User Status Debug Component */}
        <UserStatus user={user} refreshUser={refreshUser} />

        {/* Upload Error Display */}
        {errors.upload && (
          <motion.div 
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="font-bold">Upload Error:</h3>
            <p>{typeof errors.upload === 'string' ? errors.upload : 'An upload error occurred'}</p>
          </motion.div>
        )}

        {/* Form Content based on Step */}
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div variants={itemVariants} className="flex justify-between mt-8">
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={goToPreviousStep}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back
            </motion.button>
          )}

          {currentStep < 3 && (
            <motion.button
              type="button"
              onClick={goToNextStep}
              className={`px-6 py-3 ${currentStep === 1 ? 'ml-auto' : ''} bg-primary hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 flex items-center`}
              whileHover={{ scale: 1.02, boxShadow: "none" }}
              whileTap={{ scale: 0.98 }}
            >
              Next <ArrowRightIcon className="h-5 w-5 ml-2" />
            </motion.button>
          )}

          {currentStep === 3 && (
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmittingCourse} // Disable on course submission
              className={`px-6 py-3 ${isSubmittingCourse ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 ml-auto flex items-center`}
              whileHover={{ scale: isSubmittingCourse ? 1 : 1.02, boxShadow: "none" }}
              whileTap={{ scale: isSubmittingCourse ? 1 : 0.98 }}
            >
              {isSubmittingCourse ? 'Submitting...' : 'Submit Course'} <SparklesIcon className="h-5 w-5 ml-2" />
            </motion.button>
          )}
        </motion.div>

        {/* Video Preview (if any) - Kept for consistency if user wants to preview in step 1 or review in step 3 */}
        {currentStep !== 2 && courseData.videoPreview && typeof courseData.videoPreview === 'string' && (
          <motion.div 
            className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-inner ring-1 ring-gray-200 dark:ring-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-3">Video Preview:</h3>
            <div className="relative overflow-hidden rounded-lg aspect-video">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={courseData.videoPreview}
                title="Course Video Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}

      </motion.div>

      {/* Lesson Add/Edit Modal */}
      <AnimatePresence>
        {isLessonModalOpen && editingLesson && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto transform"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button
                onClick={closeLessonModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <XCircleIcon className="h-8 w-8" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                {editingLesson.lessonIndex !== null ? 'Edit Lesson' : 'Add New Lesson'}
              </h2>

              {isUploading && <p className="text-center text-gray-500 mt-2">Uploading files, please wait...</p>}

              <div className="space-y-5">
                <div>
                  <label htmlFor="lessonTitle" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2">Lesson Title:</label>
                  <input
                    type="text"
                    id="lessonTitle"
                    name="title"
                    value={editingLesson.lessonData.title}
                    onChange={handleLessonModalChange}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 ring-1 ring-gray-200 dark:bg-gray-700 ${errors[`lessonTitle${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`] ? 'ring-red-500' : ''} text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary transition-all duration-300`}
                    placeholder="e.g., Understanding React Hooks"
                    required
                  />
                  {errors[`lessonTitle${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`] && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[`lessonTitle${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`]}</motion.p>}
                </div>

                <div>
                  <label htmlFor="lessonVideoFile" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2">Video File (Optional):</label>
                  <input
                    type="file"
                    id="lessonVideoFile"
                    name="videoFile"
                    accept="video/*"
                    onChange={handleLessonModalChange}
                    className={`w-full text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${errors[`lessonVideoFile${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`lessonVideoFile${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`] && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[`lessonVideoFile${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`]}</motion.p>}
                </div>

                <div>
                  <label htmlFor="lessonMaterialFile" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2">Material File (PDF/DOCX, Optional):</label>
                  <input
                    type="file"
                    id="lessonMaterialFile"
                    name="materialFile"
                    accept=".pdf,.doc,.docx"
                    onChange={handleLessonModalChange}
                    className={`w-full text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${errors[`lessonMaterialFile${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`lessonMaterialFile${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`] && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[`lessonMaterialFile${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`]}</motion.p>}
                </div>

                <div>
                  <label htmlFor="lessonDuration" className="block text-gray-800 dark:text-gray-200 text-base font-semibold mb-2">Duration (e.g., 30 min):</label>
                  <input
                    type="text"
                    id="lessonDuration"
                    name="duration"
                    value={editingLesson.lessonData.duration}
                    onChange={handleLessonModalChange}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 ring-1 ring-gray-200 dark:bg-gray-700 ${errors[`lessonDuration${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`] ? 'ring-red-500' : ''} text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary transition-all duration-300`}
                    placeholder="e.g., 30 min"
                  />
                  {errors[`lessonDuration${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`] && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[`lessonDuration${editingLesson.sectionIndex}-${editingLesson.lessonIndex === null ? 'new' : editingLesson.lessonIndex}`]}</motion.p>}
                </div>

                <motion.button
                  type="button"
                  onClick={saveLesson}
                  disabled={isUploading} // Disable button when uploading
                  className={`w-full px-6 py-3 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 flex items-center justify-center`}
                  whileHover={{ scale: isUploading ? 1 : 1.02, boxShadow: "none" }}
                  whileTap={{ scale: isUploading ? 1 : 0.98 }}
                >
                  {isUploading ? 'Uploading...' : 'Save Lesson'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

export default AddCourse;

