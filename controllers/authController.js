require('dotenv').config()
const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const OTP = require('../models/OtpModel')


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


const register = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password, location, skills } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Invalid value at password field" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            password: hashedPassword,
            location,
            skills
        })

        await user.save()
        return res.status(201).json({ message: "User created successfully" })

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json(
                {
                    message: "Error creating User",
                    error: err.message
                }
            )
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const isPasswordValid = await bcrypt.comapare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        return res.status(200).json({ message: "Login successful", token })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error logging in", error: err.message })
    }
}

const sendOtpToEmail = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "An User with this Email already exists" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        const mailOptions = {
            from: `"SkillServe" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "SkillServe OTP Verification",
            text: `Your OTP is ${otp}. It will expire in 10 minutes. If you did not request this, please ignore this email.`,
        }

        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { new: true, upsert: true }
        )
        await transporter.sendMail(mailOptions)

        return res.status(200).json({ message: "OTP sent successfully" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error sending OTP", error: err.message })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        if(!email||!otp){
            return res.status(400).json({message: "Email and OTP required"})
        }
        const otpRecord = await OTP.findOne({email,otp})
        if(!otpRecord){
            return res.status(400).json({message: "Invalid Credentials"})
        }
        return res.status(200).json({message: "OTP Verified Successfully"})
    }
    catch (err) { 
        console.log(err)
        return res.status(500).json({message:"Error verifying OTP", error: err.message})
    }
}


module.exports = { register, login, sendOtpToEmail , verifyOtp}