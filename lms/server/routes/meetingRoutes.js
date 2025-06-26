const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Mock meetings data - In production, this would come from a database
let meetingsData = [
  {
    id: 'meet-1',
    title: '1:1 Coaching Session',
    participants: [
      { id: 'educator-1', name: 'Dr. Smith', role: 'educator', avatar: 'https://i.pravatar.cc/40?img=10' },
      { id: 'user-1', name: 'Alice Johnson', role: 'student', avatar: 'https://i.pravatar.cc/40?img=1' }
    ],
    scheduledBy: 'educator-1',
    date: '2024-02-01',
    time: '10:00',
    duration: 60, // minutes
    platform: 'Google Meet',
    link: 'https://meet.google.com/abc-xyz-123',
    status: 'scheduled', // scheduled, completed, cancelled
    description: 'Discuss course progress and answer questions',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'meet-2',
    title: 'Office Hours - JavaScript Q&A',
    participants: [
      { id: 'educator-1', name: 'Dr. Smith', role: 'educator', avatar: 'https://i.pravatar.cc/40?img=10' },
      { id: 'user-2', name: 'Bob Smith', role: 'student', avatar: 'https://i.pravatar.cc/40?img=2' }
    ],
    scheduledBy: 'user-2',
    date: '2024-01-30',
    time: '14:00',
    duration: 30,
    platform: 'Zoom',
    link: 'https://zoom.us/j/123456789',
    status: 'scheduled',
    description: 'Help with JavaScript concepts and debugging',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z'
  }
];

// GET /api/meetings - Get meetings for the current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { status, upcoming } = req.query;
    
    console.log(`📅 Getting meetings for user ${userId} with role ${role}`);
    
    // Filter meetings where user is a participant
    let userMeetings = meetingsData.filter(meeting => 
      meeting.participants.some(p => p.id === userId)
    );
    
    // Apply filters
    if (status) {
      userMeetings = userMeetings.filter(meeting => meeting.status === status);
    }
    
    if (upcoming === 'true') {
      const now = new Date();
      userMeetings = userMeetings.filter(meeting => {
        const meetingDateTime = new Date(`${meeting.date}T${meeting.time}:00`);
        return meetingDateTime > now && meeting.status === 'scheduled';
      });
    }
    
    // Sort by date and time
    userMeetings.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`);
      const dateB = new Date(`${b.date}T${b.time}:00`);
      return dateA - dateB;
    });
    
    res.json({
      success: true,
      data: userMeetings
    });
  } catch (error) {
    console.error('❌ Error fetching meetings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch meetings'
    });
  }
});

// POST /api/meetings - Schedule a new meeting
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id: schedulerId, name: schedulerName, role: schedulerRole } = req.user;
    const { 
      title, 
      participantId, 
      participantName, 
      participantRole,
      date, 
      time, 
      duration = 60, 
      platform, 
      description = '' 
    } = req.body;
    
    console.log(`📅 Scheduling new meeting by ${schedulerName} with ${participantName}`);
    
    // Validation
    if (!title || !participantId || !date || !time || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Title, participant, date, time, and platform are required'
      });
    }
    
    // Validate date format and ensure it's in the future
    const meetingDateTime = new Date(`${date}T${time}:00`);
    if (isNaN(meetingDateTime.getTime()) || meetingDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date/time or meeting must be scheduled for the future'
      });
    }
    
    // Generate meeting link based on platform
    let meetingLink = '';
    const randomId = Math.random().toString(36).substring(2, 8);
    
    switch (platform.toLowerCase()) {
      case 'google meet':
        meetingLink = `https://meet.google.com/${randomId}-${randomId}-${randomId}`;
        break;
      case 'zoom':
        meetingLink = `https://zoom.us/j/${Date.now().toString().slice(-10)}`;
        break;
      case 'microsoft teams':
        meetingLink = `https://teams.microsoft.com/l/meetup-join/${randomId}`;
        break;
      default:
        meetingLink = `https://${platform.toLowerCase().replace(' ', '')}.com/join/${randomId}`;
    }
    
    const newMeeting = {
      id: `meet-${Date.now()}`,
      title,
      participants: [
        { 
          id: schedulerId, 
          name: schedulerName, 
          role: schedulerRole, 
          avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 10) + 1}` 
        },
        { 
          id: participantId, 
          name: participantName, 
          role: participantRole, 
          avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 10) + 1}` 
        }
      ],
      scheduledBy: schedulerId,
      date,
      time,
      duration,
      platform,
      link: meetingLink,
      status: 'scheduled',
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    meetingsData.push(newMeeting);
    
    res.status(201).json({
      success: true,
      data: newMeeting,
      message: 'Meeting scheduled successfully'
    });
  } catch (error) {
    console.error('❌ Error scheduling meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to schedule meeting'
    });
  }
});

// PUT /api/meetings/:meetingId - Update meeting details
router.put('/:meetingId', authMiddleware, async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { id: userId } = req.user;
    const updates = req.body;
    
    console.log(`📝 Updating meeting ${meetingId} by user ${userId}`);
    
    const meetingIndex = meetingsData.findIndex(meeting => meeting.id === meetingId);
    if (meetingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }
    
    const meeting = meetingsData[meetingIndex];
    
    // Check if user is a participant
    if (!meeting.participants.some(p => p.id === userId)) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to update this meeting'
      });
    }
    
    // Update allowed fields
    const allowedUpdates = ['title', 'date', 'time', 'duration', 'description', 'status'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        meeting[key] = updates[key];
      }
    });
    
    meeting.updatedAt = new Date().toISOString();
    meetingsData[meetingIndex] = meeting;
    
    res.json({
      success: true,
      data: meeting,
      message: 'Meeting updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update meeting'
    });
  }
});

// DELETE /api/meetings/:meetingId - Cancel/delete a meeting
router.delete('/:meetingId', authMiddleware, async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { id: userId } = req.user;
    
    console.log(`🗑️ Cancelling meeting ${meetingId} by user ${userId}`);
    
    const meetingIndex = meetingsData.findIndex(meeting => meeting.id === meetingId);
    if (meetingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }
    
    const meeting = meetingsData[meetingIndex];
    
    // Check if user is a participant
    if (!meeting.participants.some(p => p.id === userId)) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to cancel this meeting'
      });
    }
    
    // Instead of deleting, mark as cancelled
    meeting.status = 'cancelled';
    meeting.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Meeting cancelled successfully'
    });
  } catch (error) {
    console.error('❌ Error cancelling meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel meeting'
    });
  }
});

// GET /api/meetings/:meetingId - Get specific meeting details
router.get('/:meetingId', authMiddleware, async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { id: userId } = req.user;
    
    console.log(`📄 Getting meeting details for ${meetingId} by user ${userId}`);
    
    const meeting = meetingsData.find(meeting => meeting.id === meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }
    
    // Check if user is a participant
    if (!meeting.participants.some(p => p.id === userId)) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to view this meeting'
      });
    }
    
    res.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('❌ Error fetching meeting details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch meeting details'
    });
  }
});

// GET /api/meetings/availability/:userId - Get user availability (placeholder)
router.get('/availability/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    
    console.log(`🕐 Getting availability for user ${userId} on ${date}`);
    
    // Mock availability data - in production, this would check actual calendar
    const mockAvailability = [
      { time: '09:00', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: false }
    ];
    
    res.json({
      success: true,
      data: {
        date,
        userId,
        availability: mockAvailability
      }
    });
  } catch (error) {
    console.error('❌ Error fetching availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch availability'
    });
  }
});

module.exports = router; 