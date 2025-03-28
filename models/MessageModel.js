const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender ID is required']
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver ID is required']
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task reference is required']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for faster queries
messageSchema.index({ taskId: 1 }); // Optimize task-based message lookups
messageSchema.index({ sender: 1, receiver: 1 }); // Optimize user-to-user chats

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;