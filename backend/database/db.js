const mongoose = require('mongoose')

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("MongoDb connected Successfully ")
    } catch (error) {
        console.log("MongoDB Connection Error ",error)
    }
}

module.exports = {
    connectDB
}