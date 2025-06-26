const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: false,
  },
  color: {
    type: String,
    default: '#2196F3', // Default blue
  },
  description: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema); 