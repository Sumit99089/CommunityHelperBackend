const getUserProfile = async (req, res) => {
    const user = req.user
    if(!user){
        return res.status(404).json({message: "User Not Found"})
    }
    return res.status(200).json(user)
}

const updateUserProfile = async (req, res) => {
    try{
        const user = req.user
        const {name, email, location, skills} = req.body
        if(!user){
            return res.status(404).json({message: "User Not Found"})
        }
        user.name = name || user.name
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Error updating user profile", error : err.message})
    }
}

module.exports = { getUserProfile, updateUserProfile}