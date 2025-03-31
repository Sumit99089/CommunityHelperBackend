const express = require("express")
const router = express.Router()
const  protect  = require("../middlewares/authMiddleware")
const authController = require("../controllers/authController")
const userController = require("../controllers/userController")
const taskController = require("../controllers/taskController")
const chatController = require("../controllers/chatController")


//Authentication Endpoints
router.post("/auth/register",authController.register)
router.post("/auth/login", authController.login)
router.post("/auth/send-otp", authController.sendOtpToEmail)
router.post("/auth/verify-otp", authController.verifyOtp)

//User Endpoints
router.get("/users/me", protect,userController.getUserProfile)
router.patch("/users/me", protect ,userController.updateUserProfile)

//Tasks endpoints
router.post("/tasks", taskController.createTask)
router.get("/tasks", taskController.filterTasksByLocation)//latitude and longitude value in req.query
router.patch("/tasks/:id/status", taskController.updateTaskStatus)//id in req.params status in req.body

//Chat History endpoint
router.get("/chat/:taskId", protect, chatController.getChatHistory)

module.exports = router