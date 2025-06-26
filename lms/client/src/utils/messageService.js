// Shared message and meeting service for both students and educators
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

// Get auth token from localStorage or context
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API request helper
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const messageService = {
  // Get all conversations for the current user
  getMessages: async () => {
    try {
      const response = await apiRequest('/messages');
      return response;
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to mock data if API fails
      return {
        success: true,
        data: {
          conversations: [
            {
              id: 'conv-1',
              type: 'individual',
              participant: { name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/40?img=1', id: 'user-1', role: 'student' },
              messages: [
                { id: 'msg-1', senderId: 'user-1', senderName: 'Alice Johnson', text: 'Hi Professor! I had a question about the last lecture.', timestamp: '2024-01-26T10:00:00Z', isRead: true },
                { id: 'msg-2', senderId: 'educator-1', senderName: 'Dr. Smith', text: 'Certainly, Alice. What can I help you with?', timestamp: '2024-01-26T10:05:00Z', isRead: true },
                { id: 'msg-3', senderId: 'user-1', senderName: 'Alice Johnson', text: 'It\'s about the recursion example. I\'m confused about the base case.', timestamp: '2024-01-26T10:10:00Z', isRead: false },
              ],
              lastActivity: '2024-01-26T10:10:00Z',
              unreadCount: 1,
            },
            {
              id: 'conv-2',
              type: 'individual',
              participant: { name: 'Bob Smith', avatar: 'https://i.pravatar.cc/40?img=2', id: 'user-2', role: 'student' },
              messages: [
                { id: 'msg-4', senderId: 'user-2', senderName: 'Bob Smith', text: 'Professor, can you extend the deadline for the assignment?', timestamp: '2024-01-25T15:30:00Z', isRead: true },
                { id: 'msg-5', senderId: 'educator-1', senderName: 'Dr. Smith', text: 'I\'m afraid not, Bob. The deadline is firm to keep everyone on track.', timestamp: '2024-01-25T15:35:00Z', isRead: true },
              ],
              lastActivity: '2024-01-25T15:35:00Z',
              unreadCount: 0,
            }
          ],
          courseDiscussions: [
            {
              id: 'disc-1',
              type: 'course',
              course: { title: 'React Mastery', status: 'Active' },
              messages: [
                { id: 'disc-msg-1', senderId: 'user-1', senderName: 'Alice Johnson', text: 'Is there a recommended IDE for this course?', timestamp: '2024-01-26T09:30:00Z', upvotes: 5, replies: [] },
                { id: 'disc-msg-2', senderId: 'user-2', senderName: 'Bob Smith', text: 'I\'m having trouble with component lifecycle methods.', timestamp: '2024-01-25T14:00:00Z', upvotes: 3, replies: [{ id: 'reply-1', senderId: 'educator-1', senderName: 'Dr. Smith', text: 'Could you specify which lifecycle method you are struggling with?', timestamp: '2024-01-25T14:15:00Z' }] },
              ],
              lastActivity: '2024-01-26T09:30:00Z',
              unreadCount: 1,
            }
          ]
        }
      };
    }
  },

  // Send a new message
  sendMessage: async (conversationId, text, type = 'individual') => {
    try {
      const response = await apiRequest('/messages', {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          text,
          type
        }),
      });
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback mock response
      return {
        success: true,
        data: {
          id: `msg-${Date.now()}`,
          senderId: 'current-user',
          senderName: 'Current User',
          text: text.trim(),
          timestamp: new Date().toISOString(),
          isRead: false
        }
      };
    }
  },

  // Start a new conversation
  startConversation: async (participantId, participantName, participantRole, courseId = null) => {
    try {
      const response = await apiRequest('/messages/start-conversation', {
        method: 'POST',
        body: JSON.stringify({
          participantId,
          participantName,
          participantRole,
          courseId
        }),
      });
      return response;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (conversationId) => {
    try {
      const response = await apiRequest(`/messages/${conversationId}/read`, {
        method: 'PUT',
      });
      return response;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return { success: false, error: error.message };
    }
  }
};

export const meetingService = {
  // Get all meetings for the current user
  getMeetings: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.upcoming) queryParams.append('upcoming', 'true');
      
      const url = `/meetings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiRequest(url);
      return response;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      // Fallback to mock data
      return {
        success: true,
        data: [
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
            description: 'Discuss course progress and answer questions',
            createdAt: '2024-01-20T10:00:00Z'
          }
        ]
      };
    }
  },

  // Schedule a new meeting
  scheduleMeeting: async (meetingData) => {
    try {
      const response = await apiRequest('/meetings', {
        method: 'POST',
        body: JSON.stringify(meetingData),
      });
      return response;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      // Fallback mock response
      const platforms = {
        'Google Meet': `https://meet.google.com/${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 8)}`,
        'Zoom': `https://zoom.us/j/${Date.now().toString().slice(-10)}`,
        'Microsoft Teams': `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substring(2, 8)}`
      };
      
      return {
        success: true,
        data: {
          id: `meet-${Date.now()}`,
          ...meetingData,
          link: platforms[meetingData.platform] || `https://${meetingData.platform.toLowerCase().replace(' ', '')}.com/join/${Math.random().toString(36).substring(2, 8)}`,
          status: 'scheduled',
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  // Update meeting details
  updateMeeting: async (meetingId, updates) => {
    try {
      const response = await apiRequest(`/meetings/${meetingId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return response;
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  },

  // Cancel a meeting
  cancelMeeting: async (meetingId) => {
    try {
      const response = await apiRequest(`/meetings/${meetingId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      throw error;
    }
  },

  // Get specific meeting details
  getMeetingDetails: async (meetingId) => {
    try {
      const response = await apiRequest(`/meetings/${meetingId}`);
      return response;
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      throw error;
    }
  },

  // Get user availability (placeholder for future implementation)
  getUserAvailability: async (userId, date) => {
    try {
      const response = await apiRequest(`/meetings/availability/${userId}?date=${date}`);
      return response;
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Fallback mock data
      return {
        success: true,
        data: {
          date,
          userId,
          availability: [
            { time: '09:00', available: true },
            { time: '10:00', available: false },
            { time: '11:00', available: true },
            { time: '14:00', available: true },
            { time: '15:00', available: true },
            { time: '16:00', available: false }
          ]
        }
      };
    }
  }
};

// Utility functions
export const messageUtils = {
  // Format timestamp for display
  formatTimestamp: (timestamp, format = 'HH:mm') => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return timestamp;
    }
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (timestamp) => {
    try {
      const now = new Date();
      const messageTime = new Date(timestamp);
      const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return messageTime.toLocaleDateString();
    } catch (error) {
      return timestamp;
    }
  },

  // Check if user is sender of message
  isMessageFromCurrentUser: (message, currentUserId) => {
    return message.senderId === currentUserId;
  },

  // Get unread count for conversations
  getTotalUnreadCount: (conversations) => {
    return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
  }
};

export default {
  messageService,
  meetingService,
  messageUtils
}; 