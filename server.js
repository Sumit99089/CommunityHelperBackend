//Import External Dependency Modules
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const http = require('http')
const { Server } = require('socket.io')

// Import Internal Model Modules
const Message = require('./models/MessageModel')
const User = require('./models/UserModel')
const Task = require('./models/TasksModel')

//Import Internal Middleware Modules
const authenticateApiKey = require("./middlewares/authenticateApiKey")

//Import Internal Route Modules
const api = require("./routes/api")

const app = express()

// Create HTTP server
const server = http.createServer(app)

// Initialize Socket.IO
const io = new Server(server)

const PORT = process.env.PORT || 3000


//Connect MongoDB Atlas Database
mongoose.connect(process.env.MongoDB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//Middlewares
app.use(express.json())
app.use(authenticateApiKey)

app.use("/api", api)

// Socket.io middleware for authentication, allows you to access chat only if you have jwt token
io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error('Authentication error: ' + error.message));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user._id}`);
    
    // Join a room based on taskId
    socket.on('joinTaskRoom', async (taskId) => {
      try {
        // Verify user has access to this task
        const task = await Task.findById(taskId);
        if (!task) {
          socket.emit('error', { message: 'Task not found' });
          return;
        }
        
        // Check if user is authorized to access this chat
        if (!task.createdBy.equals(socket.user._id) && !task.assignedTo.equals(socket.user._id)) {
          socket.emit('error', { message: 'Not authorized to access this chat' });
          return;
        }
        
        // Join the room
        socket.join(taskId);
        console.log(`User ${socket.user._id} joined task room: ${taskId}`);
        
        // Notify user of successful join
        socket.emit('joinedRoom', { taskId });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    // Listen for new messages
    socket.on('sendMessage', async (data) => {
      try {
        const { taskId, receiverId, content } = data;
        
        // Validate task exists
        const task = await Task.findById(taskId);
        if (!task) {
          socket.emit('error', { message: 'Task not found' });
          return;
        }
        
        // Ensure message is part of a valid task conversation
        const isTaskParticipant = 
          task.createdBy.equals(socket.user._id) || 
          task.assignedTo.equals(socket.user._id);
          
        if (!isTaskParticipant) {
          socket.emit('error', { message: 'Not authorized to send messages for this task' });
          return;
        }
        
        // Create and save the new message
        const message = new Message({
          sender: socket.user._id,
          receiver: receiverId,
          taskId: taskId,
          content: content
        });
        
        await message.save();
        
        // Populate sender info before broadcasting
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name profileImage')
          .populate('receiver', 'name profileImage');
        
        // Broadcast to the task room
        io.to(taskId).emit('newMessage', populatedMessage);
        
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: error.message });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user._id}`);
    });
  });


app.listen(PORT, (err) => {
    if (err) {
        console.log(`Error starting server on port:${PORT}`)
    }
    else {
        console.log(`Server started on:${PORT}`)
        console.log(`URL: http://localhost:${PORT}`)
    }
})