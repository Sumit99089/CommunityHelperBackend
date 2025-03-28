const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const redis = require('redis')
const nodemailer = require('nodemailer')
const crypto = require('crypto')



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

        return res.status(200).json({message: "Login successful", token})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error logging in", error: err.message })
    }
}

const sendOtpToEmail = async (req, res)=>{
    const {email}= req.body
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const otp = Math.floor(Math.random)


}
module.exports = { register, login }