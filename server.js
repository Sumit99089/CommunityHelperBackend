require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const authenticateApiKey = require("./middlewares/authenticateApiKey")
const api = require("./routes/api")


const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use(authenticateApiKey)

mongoose.connect(process.env.MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


app.use("/api", api)



app.listen(PORT, (err) => {
    if (err) {
        console.log(`Error starting server on port:${PORT}`)
    }
    else {
        console.log(`Server started on:${PORT}`)
        console.log(`URL: http://localhost:${PORT}`)
    }
})