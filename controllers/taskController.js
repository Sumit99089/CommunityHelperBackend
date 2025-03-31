// //Tasks endpoints
// router.post("/tasks", taskController.createTask)
// router.get("/tasks", taskController.filterTasksByLocation)//latitude and longitude value in req.query
// router.patch("/tasks/:id/status", taskController.updateTaskStatus)//id in req.params
// title: {
//         type: String,
//         required: [true, "Title is Required"],
//         trim: true,
//         minlength: [30, 'Description must be at least 30 characters'],
//         maxlength: [60, "Title cannot exceed 60 characters"]
//     },
//     description: {
//         type: String,
//         required: [true, "Description must be atleast 200 characters long."],
//         trim: true,
//         minlength: [200, 'Description must be at least 30 characters'],
//         maxlength: [500, "Description cannot exceed 500 characters"]
//     },
//     createdBy: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: [true, "Reference to user creating task required"]
//     },
//     location: {
//         type: pointSchema,
//         required: [true, "Location is required"],
//         index: "2dsphere"
//     },
//     status: {
//         type: String,
//         enum: ["open", "in-progress", "completed"],
//         default: "open"
//     },
//     category: {
//         type: String,
//         required: true,
//         enum: [
//             'repairs', 'plumbing', 'electrical', 'carpentry',
//             'painting', 'gardening', 'cleaning', 'moving',
//             'furniture-assembly', 'pest-control', 'tech-support',
//             'web-design', 'photo-editing', 'video-editing', 'cooking',
//             'tutoring', 'fitness', 'pet-care', 'childcare',
//             'elderly-care', 'beauty', 'sewing', 'knitting',
//             'art', 'music-lessons', 'car-repair', 'bike-repair',
//             'ride-share', 'resume-help', 'event-planning', 'errands',
//             'language-translation', 'administrative', 'other'
//         ],
//         lowercase: true, // Ensures consistency
//         default: 'other'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         immutable: true
//     },
//     assignedTo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         default: null
//     }

const Task = require("../models/TasksModel")

const createTask = async (req, res) => {
    try {
        const { title, description, createdBy, assignedTo, location, status, category } = req.body

        const task = new Task({
            title,
            description,
            createdBy,
            assignedTo,
            location,
            status,
            category
        })

        await task.save()
        return res.status(201).json({ message: "Task Created Successfully", task })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ error: err.message })
    }
}

const filterTasksByLocation = async (req, res) => {
    try {
        const {latitude,longitude,radius} = req.query

        if(!latitude||!longitude){
            return res.status(400).json({message:"Latitude and Longitude are required"})
        }
        const tasks = await Task.find({
            location:{
                $near:{
                    $geometry:{
                        type:"Point",
                        location:[parseFloat(latitude),parseFloat(longitude)]
                    },
                    $maxDistance: parseFloat(radius)|| 5000
                },
                status: "open"
            }
        })
        return res.status(200).json(tasks)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Error fetching tasks", error: err.message})
    } 
}

const updateTaskStatus = async (req, res) => {

    try{
        const { id } = req.params
        const { status } = req.body

        const task = await Task.findByIdAndUpdate(id, { status }, {new: true})

        if(!task){
            return res.status(404).json({message : "Task not found"})
        }
        return res.status(200).json({message: "Task status updated successfully", task})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Error updating task status", error: err.message})
    }

}

module.exports = { createTask, filterTasksByLocation, updateTaskStatus}