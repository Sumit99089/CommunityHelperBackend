const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique : true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 }, // OTP expires in 600 seconds (10 minutes)
});

const OTP = mongoose.model("OTP", otpSchema)
module.exports = OTP