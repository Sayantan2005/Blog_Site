const express = require('express')
const dotenv = require('dotenv')
const { connectDB } = require('./database/db.js')
const userRoute = require("./routes/user.route.js")
const cors = require('cors')
const cookieParser = require("cookie-parser")
const app = express()

dotenv.config()

connectDB()

const PORT = process.env.PORT || 3000

// default middleware --> for parsing json data
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
// for add cors policy
app.use(cors({
    origin:"http://localhost:5173", //the frontend url
    credentials:true // required for cookies because we send withCredentials:true from frontend using axios
}))


app.use("/api/v1/user" , userRoute)

app.listen(PORT , ()=>{
    console.log(`Server listen at Port ${PORT}`)
})