const express = require('express')
const dotenv = require('dotenv')
const { connectDB } = require('./database/db.js')
const userRoute = require("./routes/user.route.js")
const app = express()

dotenv.config()

connectDB()

const PORT = process.env.PORT || 3000

// default middleware --> for parsing json data
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use("/api/v1/user" , userRoute)

app.listen(PORT , ()=>{
    console.log(`Server listen at Port ${PORT}`)
})