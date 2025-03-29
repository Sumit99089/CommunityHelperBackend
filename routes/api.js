const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")


//Authentication Endpoints
router.post("/auth/register",authController.register)
router.post("/auth/login", authController.login)
router.post("/auth/send-otp", authController.sendOtpToEmail)
router.post("/auth/verify-otp", authController.verifyOtp)

//User Endpoints
router.get("/users/me",userController.getUserProfile)
router.patch("/users/me", userController.updateUserProfile)

//Tasks endpoints
router.post("/tasks", taskController.createTask)
router.get("/tasks", taskController.filterTasksByLocation)//latitude and longitude value in req.query
router.patch("/tasks/:id/status", taskController.updateTaskStatus)//id in req.params


module.exports = router