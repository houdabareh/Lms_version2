import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiUpload, 
  FiCheck, 
  FiX, 
  FiFile, 
  FiArrowRight, 
  FiClock, 
  FiUser,
  FiTarget,
  FiCheckCircle,
  FiCalendar,
  FiFileText,
  FiCheckSquare
} from 'react-icons/fi';

const TaskPage = () => {
  const { courseId, taskId } = useParams();
  const navigate = useNavigate();

  // Component state
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [checklistItems, setChecklistItems] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Mock task data - in real app, this would come from props or API
  const taskData = {
    id: taskId || 1,
    title: 'Build Your First React Component',
    description: 'Create a functional React component that displays a user profile card. This task will help you practice the fundamentals of React components, props, and JSX syntax.',
    type: 'checklist', // 'checklist', 'text', or 'upload'
    estimatedTime: '30 minutes',
    instructor: 'John Smith',
    dueDate: '2024-01-15',
    requirements: [
      'Create a functional component named UserProfile',
      'Accept props for name, email, and avatar URL',
      'Display the user information in a styled card layout',
      'Use proper JSX syntax and component structure',
      'Export the component for use in other files'
    ],
    allowFileUpload: true,
    allowTextInput: true,
    nextLessonId: 2
  };

  // Initialize checklist items based on task requirements
  React.useEffect(() => {
    if (taskData.type === 'checklist' && taskData.requirements) {
      setChecklistItems(
        taskData.requirements.map((req, index) => ({
          id: index + 1,
          text: req,
          completed: false
        }))
      );
    }
  }, [taskData.type, taskData.requirements]);

  // File upload handlers
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Checklist handlers
  const toggleChecklistItem = (itemId) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  // Task completion logic
  const canMarkAsComplete = () => {
    if (taskData.type === 'checklist') {
      return checklistItems.every(item => item.completed);
    }
    if (taskData.type === 'text') {
      return textAnswer.trim().length > 0;
    }
    if (taskData.type === 'upload') {
      return uploadedFiles.length > 0;
    }
    return true;
  };

  const handleMarkComplete = () => {
    if (canMarkAsComplete()) {
      setTaskCompleted(true);
      setShowToast(true);
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (taskData.type === 'checklist' && checklistItems.length > 0) {
      const completed = checklistItems.filter(item => item.completed).length;
      return Math.round((completed / checklistItems.length) * 100);
    }
    return 0;
  };

  const getCompletedCount = () => {
    return checklistItems.filter(item => item.completed).length;
  };

  const handleNextLesson = () => {
    // Navigate to the next lesson in the course player
    // Using module 1 and the next lesson ID for simplicity
    const nextLessonId = parseInt(taskId) + 1;
    navigate(`/course-player/${courseId}/1/${nextLessonId}`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowRight className="mr-2 rotate-180" />
              Back to Course
            </button>
            <div className="flex items-center space-x-4">
              {taskCompleted && (
                <div className="flex items-center space-x-2 text-green-600">
                  <FiCheckCircle />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Enhanced Task Header */}
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiTarget className="text-blue-600" size={24} />
                </div>
                <div className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Task #{taskData.id}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{taskData.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {taskData.description}
              </p>
            </div>
            {taskCompleted && (
              <div className="ml-8 flex-shrink-0">
                <div className="bg-green-100 border border-green-200 p-4 rounded-xl text-center">
                  <FiCheckCircle className="text-green-600 mb-2 mx-auto" size={32} />
                  <div className="text-sm font-semibold text-green-800">Completed!</div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Task Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiClock className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estimated Time</div>
                  <div className="font-semibold text-gray-900">{taskData.estimatedTime}</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <FiUser className="text-emerald-600" size={20} />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Instructor</div>
                  <div className="font-semibold text-gray-900">{taskData.instructor}</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <FiCalendar className="text-amber-600" size={20} />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</div>
                  <div className="font-semibold text-gray-900">{taskData.dueDate}</div>
                </div>
              </div>
            </div>
            {taskData.type === 'checklist' && checklistItems.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FiCheckSquare className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Progress</div>
                    <div className="font-semibold text-gray-900">{getCompletedCount()}/{checklistItems.length}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Task Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiCheckSquare className="mr-2 text-blue-600" />
              Task Requirements
            </h2>
            {taskData.type === 'checklist' && checklistItems.length > 0 && (
              <div className="text-sm font-medium text-gray-600">
                {getCompletedCount()}/{checklistItems.length} completed
              </div>
            )}
          </div>

          {/* Enhanced Checklist Type */}
          {taskData.type === 'checklist' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">Complete all the requirements below to finish this task:</p>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-700">{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out relative"
                    style={{ width: `${getProgressPercentage()}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {getCompletedCount()} of {checklistItems.length} requirements completed
                </div>
              </div>

              {/* Enhanced Checklist Items */}
              <div className="space-y-3">
                {checklistItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.01] ${
                      item.completed
                        ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                    }`}
                    onClick={() => toggleChecklistItem(item.id)}
                  >
                    {/* Animated Checkbox */}
                    <div className="flex-shrink-0 relative">
                      <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        item.completed
                          ? 'border-green-500 bg-green-500 transform scale-110'
                          : 'border-gray-300 group-hover:border-blue-400 group-hover:bg-blue-50'
                      }`}>
                        {item.completed && (
                          <FiCheck 
                            className="text-white animate-bounce" 
                            size={16}
                            style={{ animationDuration: '0.6s', animationIterationCount: '1' }}
                          />
                        )}
                      </div>
                      {/* Progress indicator */}
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
                        item.completed ? 'bg-green-400 scale-100' : 'bg-transparent scale-0'
                      }`}></div>
                    </div>
                    
                    {/* Item Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium transition-all duration-300 ${
                          item.completed 
                            ? 'text-green-800 line-through' 
                            : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {item.text}
                        </p>
                        <div className="text-xs text-gray-400 ml-4">
                          #{index + 1}
                        </div>
                      </div>
                      {item.completed && (
                        <div className="mt-1 text-xs text-green-600 font-medium opacity-75">
                          ✓ Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Input Type */}
          {taskData.type === 'text' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Type your answer here..."
              />
              <div className="text-sm text-gray-500">
                {textAnswer.length} characters
              </div>
            </div>
          )}

          {/* Enhanced Additional Notes Section */}
          {taskData.type === 'checklist' && taskData.allowTextInput && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <FiFileText className="mr-2 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
                <span className="ml-2 text-sm text-gray-500">(Optional)</span>
              </div>
              <div className="relative">
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Share your thoughts, challenges faced, or additional insights about this task..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {additionalNotes.length}/500
                </div>
              </div>
              {additionalNotes.length > 0 && (
                <div className="mt-2 text-sm text-blue-600">
                  💡 Great! Your notes will help track your learning progress.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced File Upload Section */}
        {taskData.allowFileUpload && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center mb-6">
              <FiUpload className="mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">File Upload</h2>
              <span className="ml-2 text-sm text-gray-500">(Optional)</span>
            </div>
            
            {/* Enhanced Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 transform ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className={`transition-all duration-300 ${dragActive ? 'scale-110' : ''}`}>
                <FiUpload className={`mx-auto mb-4 transition-colors ${
                  dragActive ? 'text-blue-500' : 'text-gray-400'
                }`} size={48} />
              </div>
              <p className={`text-lg font-medium mb-2 transition-colors ${
                dragActive ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {dragActive ? 'Drop files here!' : 'Drag and drop files here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click the button below to browse
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Supports: Images, Documents, Code files (Max 10MB each)
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.js,.jsx,.html,.css,.zip"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FiUpload className="mr-2" />
                Choose Files
              </label>
            </div>

            {/* Enhanced Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Uploaded Files</h3>
                  <div className="text-sm text-gray-500">
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FiCheck className="text-green-600" size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center">
                            {file.name}
                            <span className="ml-2 text-green-600">✅</span>
                          </div>
                          <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-200 p-2 rounded-lg hover:bg-red-50"
                        title="Remove file"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {taskCompleted ? (
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FiCheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">Task completed successfully!</div>
                    <div className="text-sm text-green-600">Ready to move to the next lesson</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Progress Summary:</div>
                  <div className="text-sm text-gray-600">
                    {taskData.type === 'checklist' && (
                      <div className="flex items-center space-x-4">
                        <span>✅ Requirements: {getCompletedCount()}/{checklistItems.length}</span>
                        {uploadedFiles.length > 0 && <span>📎 Files: {uploadedFiles.length}</span>}
                        {additionalNotes.trim() && <span>📝 Notes: Added</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {!taskCompleted ? (
                <button
                  onClick={handleMarkComplete}
                  disabled={!canMarkAsComplete()}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform flex items-center space-x-2 ${
                    canMarkAsComplete()
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiCheck size={20} />
                  <span>Mark as Complete</span>
                </button>
              ) : (
                <button
                  onClick={handleNextLesson}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>Next Lesson</span>
                  <FiArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 animate-bounce">
            <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 max-w-sm">
              <div className="bg-green-500 p-2 rounded-full">
                <FiCheckCircle size={24} />
              </div>
              <div>
                <div className="font-semibold">Task marked as complete! 🎉</div>
                <div className="text-sm text-green-100">Great job on finishing this task!</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;