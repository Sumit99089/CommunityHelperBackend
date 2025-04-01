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