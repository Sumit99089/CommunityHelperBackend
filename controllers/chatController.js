const Message = require('../models/MessageModel');
const Task = require('../models/TasksModel');
const User = require('../models/UserModel');

// Get chat history for a specific task
const getChatHistory = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    // Verify user has access to this task (either creator or assigned to)
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is authorized to access this chat
    if (!task.createdBy.equals(userId) && !task.assignedTo.equals(userId)) {
      return res.status(403).json({ message: "Not authorized to access this chat" });
    }

    // Get messages for this task
    const messages = await Message.find({ taskId })
      .sort({ timestamp: 1 })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    return res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching chat history", error: err.message });
  }
};

module.exports = { getChatHistory };
