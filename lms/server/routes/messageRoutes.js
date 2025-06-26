const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Mock data - In production, this would come from a database
let messagesData = {
  conversations: [
    {
      id: 'conv-1',
      type: 'individual',
      participants: [
        { id: 'user-1', name: 'Alice Johnson', role: 'student', avatar: 'https://i.pravatar.cc/40?img=1' },
        { id: 'educator-1', name: 'Dr. Smith', role: 'educator', avatar: 'https://i.pravatar.cc/40?img=10' }
      ],
      course: null,
      messages: [
        { 
          id: 'msg-1', 
          senderId: 'user-1', 
          senderName: 'Alice Johnson', 
          text: 'Hi Professor! I had a question about the last lecture.', 
          timestamp: '2024-01-26T10:00:00Z', 
          isRead: true 
        },
        { 
          id: 'msg-2', 
          senderId: 'educator-1', 
          senderName: 'Dr. Smith', 
          text: 'Certainly, Alice. What can I help you with?', 
          timestamp: '2024-01-26T10:05:00Z', 
          isRead: true 
        },
        { 
          id: 'msg-3', 
          senderId: 'user-1', 
          senderName: 'Alice Johnson', 
          text: 'It\'s about the recursion example. I\'m confused about the base case.', 
          timestamp: '2024-01-26T10:10:00Z', 
          isRead: false 
        }
      ],
      lastActivity: '2024-01-26T10:10:00Z',
      unreadCount: { 'educator-1': 1, 'user-1': 0 }
    },
    {
      id: 'conv-2',
      type: 'individual',
      participants: [
        { id: 'user-2', name: 'Bob Smith', role: 'student', avatar: 'https://i.pravatar.cc/40?img=2' },
        { id: 'educator-1', name: 'Dr. Smith', role: 'educator', avatar: 'https://i.pravatar.cc/40?img=10' }
      ],
      course: null,
      messages: [
        { 
          id: 'msg-4', 
          senderId: 'user-2', 
          senderName: 'Bob Smith', 
          text: 'Professor, can you extend the deadline for the assignment?', 
          timestamp: '2024-01-25T15:30:00Z', 
          isRead: true 
        },
        { 
          id: 'msg-5', 
          senderId: 'educator-1', 
          senderName: 'Dr. Smith', 
          text: 'I\'m afraid not, Bob. The deadline is firm to keep everyone on track.', 
          timestamp: '2024-01-25T15:35:00Z', 
          isRead: true 
        }
      ],
      lastActivity: '2024-01-25T15:35:00Z',
      unreadCount: { 'educator-1': 0, 'user-2': 0 }
    }
  ],
  courseDiscussions: [
    {
      id: 'disc-1',
      type: 'course',
      courseId: 'course-1',
      course: { title: 'React Mastery', status: 'Active' },
      participants: ['educator-1', 'user-1', 'user-2', 'user-3'],
      messages: [
        { 
          id: 'disc-msg-1', 
          senderId: 'user-1', 
          senderName: 'Alice Johnson', 
          text: 'Is there a recommended IDE for this course?', 
          timestamp: '2024-01-26T09:30:00Z', 
          upvotes: 5, 
          replies: [] 
        },
        { 
          id: 'disc-msg-2', 
          senderId: 'user-2', 
          senderName: 'Bob Smith', 
          text: 'I\'m having trouble with component lifecycle methods.', 
          timestamp: '2024-01-25T14:00:00Z', 
          upvotes: 3, 
          replies: [
            { 
              id: 'reply-1', 
              senderId: 'educator-1', 
              senderName: 'Dr. Smith', 
              text: 'Could you specify which lifecycle method you are struggling with?', 
              timestamp: '2024-01-25T14:15:00Z' 
            }
          ] 
        }
      ],
      lastActivity: '2024-01-26T09:30:00Z',
      unreadCount: { 'educator-1': 1 }
    }
  ]
};

let meetingsData = [
  {
    id: 'meet-1',
    title: '1:1 Coaching Session',
    participants: [
      { id: 'educator-1', name: 'Dr. Smith', role: 'educator' },
      { id: 'user-1', name: 'Alice Johnson', role: 'student' }
    ],
    scheduledBy: 'educator-1',
    date: '2024-02-01',
    time: '10:00',
    duration: 60,
    platform: 'Google Meet',
    link: 'https://meet.google.com/abc-xyz-123',
    status: 'scheduled',
    createdAt: '2024-01-20T10:00:00Z'
  }
];

// GET /api/messages - Get conversations for the current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    
    console.log(`📥 Getting messages for user ${userId} with role ${role}`);
    
    // Filter conversations based on user participation
    const userConversations = messagesData.conversations.filter(conv => 
      conv.participants.some(p => p.id === userId)
    );
    
    // Filter course discussions based on user participation  
    const userCourseDiscussions = messagesData.courseDiscussions.filter(disc => 
      disc.participants.includes(userId)
    );
    
    // Transform data based on user role and perspective
    const transformedConversations = userConversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p.id !== userId);
      return {
        ...conv,
        participant: otherParticipant,
        unreadCount: conv.unreadCount[userId] || 0
      };
    });
    
    const transformedDiscussions = userCourseDiscussions.map(disc => ({
      ...disc,
      unreadCount: disc.unreadCount[userId] || 0
    }));
    
    res.json({
      success: true,
      data: {
        conversations: transformedConversations,
        courseDiscussions: transformedDiscussions
      }
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

// POST /api/messages - Send a new message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id: senderId, name: senderName } = req.user;
    const { conversationId, text, type = 'individual' } = req.body;
    
    console.log(`💬 New message from ${senderName} in conversation ${conversationId}`);
    
    if (!text || !conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID and message text are required'
      });
    }
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    if (type === 'individual') {
      // Find and update conversation
      const conversation = messagesData.conversations.find(conv => conv.id === conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found'
        });
      }
      
      conversation.messages.push(newMessage);
      conversation.lastActivity = newMessage.timestamp;
      
      // Update unread counts for other participants
      conversation.participants.forEach(participant => {
        if (participant.id !== senderId) {
          conversation.unreadCount[participant.id] = (conversation.unreadCount[participant.id] || 0) + 1;
        }
      });
      
    } else if (type === 'course') {
      // Handle course discussion
      const discussion = messagesData.courseDiscussions.find(disc => disc.id === conversationId);
      if (!discussion) {
        return res.status(404).json({
          success: false,
          error: 'Course discussion not found'
        });
      }
      
      const newDiscussionMessage = {
        ...newMessage,
        upvotes: 0,
        replies: []
      };
      
      discussion.messages.push(newDiscussionMessage);
      discussion.lastActivity = newMessage.timestamp;
      
      // Update unread counts for all participants except sender
      discussion.participants.forEach(participantId => {
        if (participantId !== senderId) {
          discussion.unreadCount[participantId] = (discussion.unreadCount[participantId] || 0) + 1;
        }
      });
    }
    
    res.json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// POST /api/messages/start-conversation - Start a new conversation
router.post('/start-conversation', authMiddleware, async (req, res) => {
  try {
    const { id: userId, name: userName, role: userRole } = req.user;
    const { participantId, participantName, participantRole, courseId = null } = req.body;
    
    console.log(`🆕 Starting new conversation between ${userName} and ${participantName}`);
    
    if (!participantId || !participantName) {
      return res.status(400).json({
        success: false,
        error: 'Participant information is required'
      });
    }
    
    // Check if conversation already exists
    const existingConversation = messagesData.conversations.find(conv => 
      conv.participants.some(p => p.id === userId) && 
      conv.participants.some(p => p.id === participantId)
    );
    
    if (existingConversation) {
      return res.json({
        success: true,
        data: {
          ...existingConversation,
          participant: existingConversation.participants.find(p => p.id !== userId)
        }
      });
    }
    
    // Create new conversation
    const newConversation = {
      id: `conv-${Date.now()}`,
      type: 'individual',
      participants: [
        { id: userId, name: userName, role: userRole, avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 10) + 1}` },
        { id: participantId, name: participantName, role: participantRole, avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 10) + 1}` }
      ],
      course: courseId,
      messages: [],
      lastActivity: new Date().toISOString(),
      unreadCount: { [userId]: 0, [participantId]: 0 }
    };
    
    messagesData.conversations.push(newConversation);
    
    res.json({
      success: true,
      data: {
        ...newConversation,
        participant: newConversation.participants.find(p => p.id !== userId)
      }
    });
  } catch (error) {
    console.error('❌ Error starting conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start conversation'
    });
  }
});

// PUT /api/messages/:conversationId/read - Mark messages as read
router.put('/:conversationId/read', authMiddleware, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { id: userId } = req.user;
    
    console.log(`👁️ Marking messages as read for user ${userId} in conversation ${conversationId}`);
    
    const conversation = messagesData.conversations.find(conv => conv.id === conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    // Mark messages as read and reset unread count
    conversation.unreadCount[userId] = 0;
    conversation.messages.forEach(msg => {
      if (msg.senderId !== userId) {
        msg.isRead = true;
      }
    });
    
    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark messages as read'
    });
  }
});

module.exports = router; 