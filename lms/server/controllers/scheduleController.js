const Schedule = require('../models/Schedule');

// Create or update event
exports.createOrUpdateEvent = async (req, res) => {
  const userId = req.user.id; // User ID from auth middleware
  const { id, title, description, start, end, color, link } = req.body;

  if (!title || !start) {
    return res.status(400).json({ message: "Title and start date are required." });
  }

  try {
    let scheduleEvent;
    if (id) {
      // Update existing event
      scheduleEvent = await Schedule.findOneAndUpdate(
        { _id: id, user: userId }, // Ensure event belongs to the user
        { title, description, start, end, color, link },
        { new: true, runValidators: true }
      );
      if (!scheduleEvent) return res.status(404).json({ message: "Event not found or not yours." });
    } else {
      // Create new event
      scheduleEvent = new Schedule({ title, description, start, end, color, link, user: userId });
      await scheduleEvent.save();
    }

    res.status(200).json(scheduleEvent);
  } catch (error) {
    console.error('Error creating/updating event:', error);
    res.status(500).json({ message: "Server error creating/updating event." });
  }
};

exports.deleteEvent = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  console.log(`Server: Attempting to delete event with ID: ${id} for User ID: ${userId}`); // Debug log

  try {
    const deleted = await Schedule.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: "Event not found or not yours." });
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: "Server error deleting event." });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from auth middleware
    console.log('Fetching schedules for userId:', userId); // Debug log
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated or ID not found.' });
    }
    const events = await Schedule.find({ user: userId }).sort({ start: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: "Server error fetching schedules." });
  }
};

exports.createSchedule = async (req, res) => {
  res.status(200).json({ message: 'Create Schedule - Not yet implemented' });
};
