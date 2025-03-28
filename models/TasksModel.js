const mongoose = require("mongoose")
const pointSchema = require("./GeoPointModel")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is Required"],
        trim: true,
        minlength: [30, 'Description must be at least 30 characters'],
        maxlength: [60, "Title cannot exceed 60 characters"]
    },
    description: {
        type: String,
        required: [true, "Description must be atleast 200 characters long."],
        trim: true,
        minlength: [200, 'Description must be at least 30 characters'],
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "Reference to user creating task required"]
    },
    location: {
        type: pointSchema,
        required: [true, "Location is required"],
        index: "2dsphere"
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "completed"],
        default: "open"
    },
    category: {
        type: String,
        required: true,
        enum: [
            'repairs', 'plumbing', 'electrical', 'carpentry',
            'painting', 'gardening', 'cleaning', 'moving',
            'furniture-assembly', 'pest-control', 'tech-support',
            'web-design', 'photo-editing', 'video-editing', 'cooking',
            'tutoring', 'fitness', 'pet-care', 'childcare',
            'elderly-care', 'beauty', 'sewing', 'knitting',
            'art', 'music-lessons', 'car-repair', 'bike-repair',
            'ride-share', 'resume-help', 'event-planning', 'errands',
            'language-translation', 'administrative', 'other'
        ],
        lowercase: true, // Ensures consistency
        default: 'other'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
}
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

