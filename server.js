const express = require("express")
const cors = require("cors")
require("dotenv").config()
const authenticateApiKey = require("./middlewares/authenticateApiKey")

const app = express()

const PORT = process.env.PORT||3000




app.get("/",authenticateApiKey, (req,res)=>{
    res.send("hi")
})


app.listen(PORT,(err)=>{
    if(err){
        console.log(`Error starting server on port:${PORT}`)
    }
    else{
        console.log(`Server started on:${PORT}`)
        console.log(`URL: http://localhost:${PORT}`)
    }
})