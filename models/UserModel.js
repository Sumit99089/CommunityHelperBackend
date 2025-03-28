const mongoose = require("mongoose")

const pointSchema = require("./GeoPointModel")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false // Never return password in queries
    },
    location: {
        type: pointSchema,
        required: [true, 'Location is required'],
        index: '2dsphere' // Geospatial index for queries like $near
    },
    skills: {
        type: [String],
        default: [],
        validate: {
            validator: (skills) => skills.length <= 10,
            message: 'Maximum 10 skills allowed'
        }
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    tasksCompleted: {
        type: Number,
        default: 0,
        min: [0, 'Tasks completed cannot be negative']
    },
    profileImage: {
        type: String,
        default: 'https://res.cloudinary.com/your-cloud/image/upload/default-profile.jpg',
        match: [/^https?:\/\/.+\..+/, 'Invalid image URL']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true // Cannot be modified after creation
    }
},
    {
        timestamps: true,
    }
);


const User = mongoose.model('User', userSchema);
module.exports = User;