import React, { useState, useEffect, useRef, useContext, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import {
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  CalendarDaysIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  LinkIcon,
  FaceSmileIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  XMarkIcon,
  PlusIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import moment from 'moment';
import { messageService, meetingService, messageUtils } from '../../../utils/messageService';

const ChatDashboard = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [courseDiscussions, setCourseDiscussions] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Meeting modal state
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    participantId: '',
    participantName: '',
    date: '',
    time: '',
    duration: 60,
    platform: 'Google Meet',
    description: ''
  });
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedThread) {
      setMessages(selectedThread.messages || []);
    } else {
      setMessages([]);
    }
  }, [selectedThread]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [messagesResponse, meetingsResponse] = await Promise.all([
        messageService.getMessages(),
        meetingService.getMeetings()
      ]);
      
      if (messagesResponse.success) {
        setConversations(messagesResponse.data.conversations);
        setCourseDiscussions(messagesResponse.data.courseDiscussions);
        
        // Set initial selected thread
        if (messagesResponse.data.conversations.length > 0 && !selectedThread) {
          setSelectedThread(messagesResponse.data.conversations[0]);
        }
      }
      
      if (meetingsResponse.success) {
        setMeetings(meetingsResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread) return;

    try {
      const response = await messageService.sendMessage(selectedThread.id, newMessage, selectedThread.type);
      
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
        
        // Update the conversation's last message
        if (selectedThread.type === 'individual') {
          setConversations(prev => 
            prev.map(conv => 
              conv.id === selectedThread.id 
                ? { ...conv, messages: [...conv.messages, response.data], lastActivity: response.data.timestamp }
                : conv
            )
          );
        } else if (selectedThread.type === 'course') {
          setCourseDiscussions(prev => 
            prev.map(disc => 
              disc.id === selectedThread.id 
                ? { ...disc, messages: [...disc.messages, response.data], lastActivity: response.data.timestamp }
                : disc
            )
          );
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    
    try {
      const meetingData = {
        ...meetingDetails,
        participantRole: 'student'
      };
      
      const response = await meetingService.scheduleMeeting(meetingData);
      
      if (response.success) {
        setMeetings(prev => [...prev, response.data]);
        setMeetingModalOpen(false);
        setMeetingDetails({
          title: '',
          participantId: '',
          participantName: '',
          date: '',
          time: '',
          duration: 60,
          platform: 'Google Meet',
          description: ''
        });
        
        // Show success message with meeting link
        alert(`Meeting scheduled successfully! Link: ${response.data.link}`);
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const openMeetingModal = () => {
    if (selectedThread && selectedThread.type === 'individual') {
      setMeetingDetails(prev => ({
        ...prev,
        participantId: selectedThread.participant.id,
        participantName: selectedThread.participant.name,
        title: `1:1 Session with ${selectedThread.participant.name}`
      }));
    }
    setMeetingModalOpen(true);
  };

  const getTimeSeparator = (currentMsgTimestamp, prevMsgTimestamp) => {
    const current = new Date(currentMsgTimestamp);
    if (!prevMsgTimestamp) {
      return formatDateSeparator(current);
    }
    const prev = new Date(prevMsgTimestamp);
    if (current.toDateString() !== prev.toDateString()) {
      return formatDateSeparator(current);
    }
    return null;
  };

  const formatDateSeparator = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'chats': return conversations;
      case 'courseQuestions': return courseDiscussions;
      case 'meetings': return meetings;
      default: return [];
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const sidebarItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } },
  };

  const meetingProviders = [
    { name: 'Google Meet', icon: VideoCameraIcon },
    { name: 'Zoom', icon: PhoneIcon },
    { name: 'Microsoft Teams', icon: UsersIcon },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 transition-colors duration-200">
      {/* Left Sidebar - Threads/Channels */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="p-4 flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('chats'); setSelectedThread(conversations[0] || null); }}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${activeTab === 'chats' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 inline-block mr-1" /> Chats
            {conversations.reduce((total, conv) => total + conv.unreadCount, 0) > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {conversations.reduce((total, conv) => total + conv.unreadCount, 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('courseQuestions'); setSelectedThread(courseDiscussions[0] || null); }}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${activeTab === 'courseQuestions' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <LightBulbIcon className="h-5 w-5 inline-block mr-1" /> Questions
            {courseDiscussions.reduce((total, disc) => total + disc.unreadCount, 0) > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {courseDiscussions.reduce((total, disc) => total + disc.unreadCount, 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('meetings'); setSelectedThread(meetings[0] || null); }}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${activeTab === 'meetings' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <CalendarDaysIcon className="h-5 w-5 inline-block mr-1" /> Meetings
          </button>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto p-2">
          {activeTab === 'chats' && conversations.map((thread, index) => (
            <motion.div
              key={thread.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedThread?.id === thread.id ? 'bg-blue-50' : 'hover:bg-gray-100'} mb-2 relative`}
              onClick={() => setSelectedThread(thread)}
              variants={sidebarItemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <img src={thread.participant.avatar} alt={thread.participant.name} className="h-10 w-10 rounded-full mr-3" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 truncate">{thread.participant.name}</span>
                  <span className="text-xs text-gray-500">{moment(thread.lastActivity).fromNow()}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{thread.messages[thread.messages.length - 1]?.text}</p>
              </div>
              {thread.unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{thread.unreadCount}</span>
              )}
            </motion.div>
          ))}
          
          {activeTab === 'courseQuestions' && courseDiscussions.map((thread, index) => (
            <motion.div
              key={thread.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedThread?.id === thread.id ? 'bg-blue-50' : 'hover:bg-gray-100'} mb-2 relative`}
              onClick={() => setSelectedThread(thread)}
              variants={sidebarItemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 text-blue-600">💡</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 truncate">{thread.course.title} Questions</span>
                  <span className="text-xs text-gray-500">{moment(thread.lastActivity).fromNow()}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{thread.messages[thread.messages.length - 1]?.text}</p>
              </div>
              {thread.unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{thread.unreadCount}</span>
              )}
            </motion.div>
          ))}
          
          {activeTab === 'meetings' && meetings.map((thread, index) => (
            <motion.div
              key={thread.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedThread?.id === thread.id ? 'bg-blue-50' : 'hover:bg-gray-100'} mb-2 relative`}
              onClick={() => setSelectedThread(thread)}
              variants={sidebarItemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="h-10 w-10 flex items-center justify-center bg-green-100 rounded-full mr-3 text-green-600">📅</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 truncate">{thread.title}</span>
                  <span className="text-xs text-gray-500">{moment(thread.createdAt).fromNow()}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{`${thread.date} at ${thread.time} via ${thread.platform}`}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                {selectedThread.type === 'individual' && (
                  <img src={selectedThread.participant.avatar} alt={selectedThread.participant.name} className="h-10 w-10 rounded-full mr-3" />
                )}
                {selectedThread.type === 'course' && (
                  <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 text-blue-600">💡</div>
                )}
                {selectedThread.type === 'meeting' && (
                  <div className="h-10 w-10 flex items-center justify-center bg-green-100 rounded-full mr-3 text-green-600">📅</div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedThread.type === 'individual' && selectedThread.participant.name}
                  {selectedThread.type === 'course' && `${selectedThread.course.title} Questions`}
                  {selectedThread.type === 'meeting' && selectedThread.title}
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                {selectedThread.type === 'individual' && (
                  <button
                    onClick={openMeetingModal}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                  >
                    <CalendarDaysIcon className="h-5 w-5 mr-2" /> Schedule Meeting
                  </button>
                )}
                {selectedThread.type === 'meeting' && (
                  <a
                    href={selectedThread.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                  >
                    <LinkIcon className="h-5 w-5 mr-2" /> Join Meeting
                  </a>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <EllipsisVerticalIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            {selectedThread.type !== 'meeting' ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg, index) => {
                    const prevMsg = messages[index - 1];
                    const separator = getTimeSeparator(msg.timestamp, prevMsg?.timestamp);
                    const isMe = msg.senderId === 'educator-1'; // Replace with actual user ID
                    const senderAvatar = isMe ? 'https://i.pravatar.cc/40?img=10' : (selectedThread.type === 'individual' ? selectedThread.participant.avatar : 'https://i.pravatar.cc/40?img=5');

                    return (
                      <Fragment key={msg.id}>
                        {separator && (
                          <div className="text-center my-4">
                            <span className="inline-block px-4 py-1 rounded-full bg-gray-200 text-xs text-gray-600">{separator}</span>
                          </div>
                        )}
                        <motion.div
                          className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'}`}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {!isMe && senderAvatar && (
                            <img src={senderAvatar} alt={msg.senderName} className="h-8 w-8 rounded-full mr-3" />
                          )}
                          <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${isMe ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                            {!isMe && <p className="font-semibold text-sm mb-1">{msg.senderName}</p>}
                            <p className="text-sm break-words">{msg.text}</p>
                            <span className={`block text-right text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                              {moment(msg.timestamp).format('HH:mm')}
                            </span>
                          </div>
                          {isMe && (
                            <div className="ml-3">
                              <img src="https://i.pravatar.cc/40?img=10" alt="Me" className="h-8 w-8 rounded-full" />
                            </div>
                          )}
                        </motion.div>
                      </Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <FaceSmileIcon className="h-6 w-6" />
                    </button>
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <PaperClipIcon className="h-6 w-6" />
                    </button>
                    <input
                      type="text"
                      id="message-input"
                      name="message"
                      autocomplete="off"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200">
                      <PaperAirplaneIcon className="h-6 w-6 -rotate-45" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Meeting Details View */
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center mb-6">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDaysIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedThread.title}</h3>
                    <p className="text-gray-600">{selectedThread.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedThread.date}</p>
                          <p className="text-sm text-gray-600">{selectedThread.time} ({selectedThread.duration} minutes)</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedThread.platform}</p>
                          <a href={selectedThread.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {selectedThread.link}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Participants</h4>
                      {selectedThread.participants?.map((participant) => (
                        <div key={participant.id} className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{participant.name}</p>
                            <p className="text-sm text-gray-600 capitalize">{participant.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center space-x-4">
                    <a
                      href={selectedThread.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                    >
                      <LinkIcon className="h-5 w-5 mr-2" /> Join Meeting
                    </a>
                    <button className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium">
                      <PaperClipIcon className="h-5 w-5 mr-2" /> Copy Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col text-gray-600">
            <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
          </div>
        )}
      </div>

      {/* Meeting Scheduling Modal */}
      <Transition appear show={meetingModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setMeetingModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Schedule Meeting
                  </Dialog.Title>
                  
                  <form onSubmit={handleScheduleMeeting} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        id="meeting-title"
                        name="title"
                        autocomplete="off"
                        value={meetingDetails.title}
                        onChange={(e) => setMeetingDetails(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Meeting title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                              <input
                          type="date"
                          id="meeting-date"
                          name="date"
                          autocomplete="off"
                          value={meetingDetails.date}
                          onChange={(e) => setMeetingDetails(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                              <input
                          type="time"
                          id="meeting-time"
                          name="time"
                          autocomplete="off"
                          value={meetingDetails.time}
                          onChange={(e) => setMeetingDetails(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <select
                        id="meeting-duration"
                        name="duration"
                        autocomplete="off"
                        value={meetingDetails.duration}
                        onChange={(e) => setMeetingDetails(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                      <select
                        id="meeting-platform"
                        name="platform"
                        autocomplete="off"
                        value={meetingDetails.platform}
                        onChange={(e) => setMeetingDetails(prev => ({ ...prev, platform: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {meetingProviders.map((provider) => (
                          <option key={provider.name} value={provider.name}>{provider.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <textarea
                        id="meeting-description"
                        name="description"
                        autocomplete="off"
                        value={meetingDetails.description}
                        onChange={(e) => setMeetingDetails(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Meeting agenda or description"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setMeetingModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200"
                      >
                        Schedule Meeting
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ChatDashboard;

