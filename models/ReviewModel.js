const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task reference is required'],
    immutable: true
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer ID is required'],
    immutable: true
  },
  reviewee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewee ID is required'],
    immutable: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [300, 'Comment cannot exceed 300 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

// Indexes for performance
reviewSchema.index({ taskId: 1, unique: true }); // Ensure one review per task
reviewSchema.index({ reviewee: 1 }); // Speed up user rating lookups

// Prevent duplicate reviews for the same task
reviewSchema.index({ taskId: 1, reviewer: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;