// server/models/Course.js
const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  materialUrl: String,
  duration: String,
  summary: String,
  questions: [String],
});

const SectionSchema = new mongoose.Schema({
  title: String,
  lessons: [LessonSchema],
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  learning_outcomes: [String],
  thumbnailUrl: String,
  price: Number,
  videoPreviewUrl: String,
  educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  curriculum: [SectionSchema],
  // Approval audit fields
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: Date,
  rejectionReason: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', CourseSchema);
