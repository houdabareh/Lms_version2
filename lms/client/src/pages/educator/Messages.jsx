import React, { useState, useEffect, useContext, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition, Menu } from '@headlessui/react';
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
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { ThemeContext } from '../../context/ThemeContext';
import moment from 'moment';

const messagesData = {
  chats: [
    {
      id: 'chat-1',
      type: 'individual',
      participant: { name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/40?img=1' },
      course: null,
      messages: [
        { id: 'msg-1', sender: 'Alice Johnson', text: 'Hi Professor! I had a quick question about the last lecture.', timestamp: '2023-10-26T10:00:00Z', isRead: true },
        { id: 'msg-2', sender: 'Me', text: 'Certainly, Alice. What can I help you with?', timestamp: '2023-10-26T10:05:00Z', isRead: true },
        { id: 'msg-3', sender: 'Alice Johnson', text: 'It\'s about the recursion example. I\'m a bit confused on the base case.', timestamp: '2023-10-26T10:10:00Z', isRead: false },
      ],
      lastActivity: '2023-10-26T10:10:00Z',
      unreadCount: 1,
    },
    {
      id: 'chat-2',
      type: 'individual',
      participant: { name: 'Bob Smith', avatar: 'https://i.pravatar.cc/40?img=2' },
      course: null,
      messages: [
        { id: 'msg-4', sender: 'Bob Smith', text: 'Professor, can you extend the deadline for the assignment?', timestamp: '2023-10-25T15:30:00Z', isRead: true },
        { id: 'msg-5', sender: 'Me', text: 'I\'m afraid not, Bob. The deadline is firm to keep everyone on track.', timestamp: '2023-10-25T15:35:00Z', isRead: true },
      ],
      lastActivity: '2023-10-25T15:35:00Z',
      unreadCount: 0,
    },
    {
      id: 'chat-3',
      type: 'individual',
      participant: { name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/40?img=3' },
      course: null,
      messages: [
        { id: 'msg-6', sender: 'Charlie Brown', text: 'Just wanted to say the last module on Redux was really helpful!', timestamp: '2023-10-24T09:00:00Z', isRead: true },
      ],
      lastActivity: '2023-10-24T09:00:00Z',
      unreadCount: 0,
    },
  ],
  courseQuestions: [
    {
      id: 'cq-1',
      type: 'course',
      course: { title: 'React Mastery', status: 'Active' },
      messages: [
        { id: 'cmnt-1', sender: 'Student A', text: 'Is there a recommended IDE for this course?', timestamp: '2023-10-26T09:30:00Z', upvotes: 5, replies: [] },
        { id: 'cmnt-2', sender: 'Student B', text: 'I\'m having trouble with component lifecycle methods.', timestamp: '2023-10-25T14:00:00Z', upvotes: 3, replies: [{ id: 'reply-1', sender: 'Me', text: 'Could you specify which lifecycle method you are struggling with?', timestamp: '2023-10-25T14:15:00Z' }] },
      ],
      lastActivity: '2023-10-26T09:30:00Z',
      unreadCount: 1,
    },
    {
      id: 'cq-2',
      type: 'course',
      course: { title: 'Advanced CSS', status: 'Active' },
      messages: [
        { id: 'cmnt-3', sender: 'Student C', text: 'Any tips on optimizing CSS performance?', timestamp: '2023-10-24T11:00:00Z', upvotes: 2, replies: [] },
      ],
      lastActivity: '2023-10-24T11:00:00Z',
      unreadCount: 0,
    },
  ],
  meetings: [
    {
      id: 'meet-1',
      type: 'meeting',
      title: '1:1 Coaching with David',
      participant: { name: 'David Lee', avatar: 'https://i.pravatar.cc/40?img=4' },
      date: '2023-11-01',
      time: '10:00 AM',
      platform: 'Google Meet',
      link: 'https://meet.google.com/abc-xyz',
      lastActivity: '2023-10-20T10:00:00Z',
      unreadCount: 0,
    },
  ],
};

const Messages = () => {
  console.log('Messages component render. messagesData:', JSON.stringify(messagesData, null, 2));
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    provider: '',
    date: '',
    time: '',
    link: '',
  });

  useEffect(() => {
    if (messagesData.chats.length > 0 && !selectedThread) {
      setSelectedThread(messagesData.chats[0] || null);
    }
  }, []);

  useEffect(() => {
    if (selectedThread) {
      setMessages(selectedThread.messages);
      if (selectedThread.unreadCount > 0) {
        selectedThread.unreadCount = 0;
      }
    } else {
      setMessages([]);
    }
  }, [selectedThread]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!selectedThread) return;

    const messageInput = e.target.elements.message.value.trim();
    if (messageInput) {
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: 'Me',
        text: messageInput,
        timestamp: new Date().toISOString(),
        isRead: true,
      };
      setMessages(prev => [...prev, newMsg]);
      e.target.elements.message.value = '';
    }
  };

  const handleMeetingSchedule = (e) => {
    e.preventDefault();
    const mockLink = `https://${meetingDetails.provider}.com/join/${Date.now().toString().slice(-6)}`;
    setMeetingDetails(prev => ({ ...prev, link: mockLink }));
    alert(`Meeting scheduled! Link: ${mockLink}`);
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

  return (
    <div className={`flex h-[calc(100vh-64px)] overflow-hidden ${theme === 'dark' ? 'bg-darkBg text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
      {/* Left Sidebar - Threads/Channels */}
      <div className={`w-80 border-r ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Messages</h2>
        </div>
        <div className="p-4 flex space-x-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => { setActiveTab('chats'); setSelectedThread(messagesData.chats[0] || null); }}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${activeTab === 'chats' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 inline-block mr-1" /> Chats
          </button>
          <button
            onClick={() => { setActiveTab('courseQuestions'); setSelectedThread(messagesData.courseQuestions[0] || null); }}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${activeTab === 'courseQuestions' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            <LightBulbIcon className="h-5 w-5 inline-block mr-1" /> Questions
          </button>
          <button
            onClick={() => { setActiveTab('meetings'); setSelectedThread(messagesData.meetings[0] || null); }}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${activeTab === 'meetings' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            <CalendarDaysIcon className="h-5 w-5 inline-block mr-1" /> Meetings
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {console.log('Debugging map section. activeTab:', activeTab, 'currentData:', messagesData[activeTab])}
          {activeTab === 'chats' && (messagesData.chats || []).map((thread, index) => (
            <motion.div
              key={thread.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedThread?.id === thread.id ? 'bg-primary/10 dark:bg-primary-dark/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} mb-2 relative`}
              onClick={() => setSelectedThread(thread)}
              variants={sidebarItemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <img src={thread.participant.avatar} alt={thread.participant.name} className="h-10 w-10 rounded-full mr-3" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{thread.participant.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{moment(thread.lastActivity).fromNow()}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{thread.messages[thread.messages.length - 1]?.text}</p>
              </div>
              {thread.unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{thread.unreadCount}</span>
              )}
            </motion.div>
          ))}
          {activeTab === 'courseQuestions' && (messagesData.courseQuestions || []).map((thread, index) => (
            <motion.div
              key={thread.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedThread?.id === thread.id ? 'bg-primary/10 dark:bg-primary-dark/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} mb-2 relative`}
              onClick={() => setSelectedThread(thread)}
              variants={sidebarItemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full mr-3 text-blue-600 dark:text-blue-300">💡</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{thread.course.title} Questions</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{moment(thread.lastActivity).fromNow()}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{thread.messages[thread.messages.length - 1]?.text}</p>
              </div>
              {thread.unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{thread.unreadCount}</span>
              )}
            </motion.div>
          ))}
          {activeTab === 'meetings' && (messagesData.meetings || []).map((thread, index) => (
            <motion.div
              key={thread.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedThread?.id === thread.id ? 'bg-primary/10 dark:bg-primary-dark/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} mb-2 relative`}
              onClick={() => setSelectedThread(thread)}
              variants={sidebarItemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="h-10 w-10 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full mr-3 text-green-600 dark:text-green-300">📅</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{thread.title}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{moment(thread.lastActivity).fromNow()}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{`Scheduled for ${thread.date} at ${thread.time}`}</p>
              </div>
              {thread.unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{thread.unreadCount}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center justify-between shadow-sm`}>
              <div className="flex items-center">
                {selectedThread.type === 'individual' && (
                  <img src={selectedThread.participant.avatar} alt={selectedThread.participant.name} className="h-10 w-10 rounded-full mr-3" />
                )}
                {selectedThread.type === 'course' && (
                  <div className="h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full mr-3 text-blue-600 dark:text-blue-300">💡</div>
                )}
                {selectedThread.type === 'meeting' && (
                  <div className="h-10 w-10 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full mr-3 text-green-600 dark:text-green-300">📅</div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedThread.type === 'individual' && selectedThread.participant.name}
                  {selectedThread.type === 'course' && `${selectedThread.course.title} Questions`}
                  {selectedThread.type === 'meeting' && selectedThread.title}
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setMeetingModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 text-sm font-medium"
                >
                  <CalendarDaysIcon className="h-5 w-5 mr-2" /> Schedule Meeting
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <EllipsisVerticalIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {messages.map((msg, index) => {
                const prevMsg = messages[index - 1];
                const separator = getTimeSeparator(msg.timestamp, prevMsg?.timestamp);
                const isMe = msg.sender === 'Me';
                const senderAvatar = isMe ? null : (selectedThread.type === 'individual' ? selectedThread.participant.avatar : 'https://i.pravatar.cc/40?img=5');

                return (
                  <Fragment key={msg.id}>
                    {separator && (
                      <div className="text-center my-4">
                        <span className="inline-block px-4 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300">{separator}</span>
                      </div>
                    )}
                    <motion.div
                      className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'}`}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {!isMe && senderAvatar && (
                        <img src={senderAvatar} alt={msg.sender} className="h-8 w-8 rounded-full mr-3" />
                      )}
                      <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
                        {!isMe && <p className="font-semibold text-sm mb-1">{msg.sender}</p>}
                        <p className="text-sm break-words">{msg.text}</p>
                        <span className={`block text-right text-xs mt-1 ${isMe ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                          {moment(msg.timestamp).format('HH:mm')}
                        </span>
                      </div>
                      {isMe && (
                        <div className="ml-3">
                          <img src="https://i.pravatar.cc/40?img=6" alt="Me" className="h-8 w-8 rounded-full" />
                        </div>
                      )}
                    </motion.div>
                  </Fragment>
                );
              })}
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaceSmileIcon className="h-6 w-6" />
                </button>
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <PaperClipIcon className="h-6 w-6" />
                </button>
                <input
                  type="text"
                  name="message"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                />
                <button type="submit" className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-200">
                  <PaperAirplaneIcon className="h-6 w-6 -rotate-45" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col text-gray-600 dark:text-gray-400">
            <ChatBubbleLeftRightIcon className="h-20 w-20 mb-4" />
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      {/* Right Panel - Course Context (Conditional) */}
      <AnimatePresence>
        {selectedThread?.type === 'course' && (
          <motion.div
            className={`w-80 border-l ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4 flex-shrink-0`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4">Course Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Title</p>
                <p className="text-lg font-semibold">{selectedThread.course.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${selectedThread.course.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                  <CheckCircleIcon className="h-4 w-4 mr-1" /> {selectedThread.course.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Reply Templates</p>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    Please refer to the syllabus.
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    This topic is covered in Module 3.
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meeting Schedule Modal */}
      <Transition appear show={meetingModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setMeetingModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
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
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 mb-4">
                    Schedule New Meeting
                  </Dialog.Title>
                  <form onSubmit={handleMeetingSchedule} className="space-y-4">
                    <div>
                      <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Meeting Platform</label>
                      <Menu as="div" className="relative mt-1 block w-full">
                        <Menu.Button className={`relative w-full cursor-default rounded-md border py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}>
                          {meetingDetails.provider || 'Select a platform'}
                          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className={`absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                            {meetingProviders.map((provider) => (
                              <Menu.Item key={provider.name}>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => setMeetingDetails(prev => ({ ...prev, provider: provider.name }))}
                                    className={`${active ? 'bg-primary text-white' : theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} group flex w-full items-center px-4 py-2 text-sm`}
                                  >
                                    <provider.icon className="mr-3 h-5 w-5" />
                                    {provider.name}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                    <div>
                      <label htmlFor="meeting-date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Date</label>
                      <input
                        type="date"
                        id="meeting-date"
                        value={meetingDetails.date}
                        onChange={(e) => setMeetingDetails(prev => ({ ...prev, date: e.target.value }))}
                        className={`mt-1 block w-full rounded-md border shadow-sm sm:text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="meeting-time" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Time</label>
                      <input
                        type="time"
                        id="meeting-time"
                        value={meetingDetails.time}
                        onChange={(e) => setMeetingDetails(prev => ({ ...prev, time: e.target.value }))}
                        className={`mt-1 block w-full rounded-md border shadow-sm sm:text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                        required
                      />
                    </div>
                    {meetingDetails.link && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Join Link</label>
                        <input
                          type="text"
                          value={meetingDetails.link}
                          readOnly
                          className={`mt-1 block w-full rounded-md border shadow-sm sm:text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                        />
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(meetingDetails.link)}
                          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                        >
                          Copy Link
                        </button>
                      </div>
                    )}
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setMeetingModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
                      >
                        Generate Link
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

export default Messages; 