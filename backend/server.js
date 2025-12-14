// Import Express framework to create the backend server
const express = require('express')

// Import dotenv to load environment variables from .env file
const dotenv = require('dotenv')

// Import MongoDB connection function
const { connectDB } = require('./database/db.js')

// Import CORS to allow frontend-backend communication
const cors = require('cors')

// Import cookie-parser to read cookies from incoming requests
const cookieParser = require("cookie-parser")

// Import route files for different modules
const userRoute = require("./routes/user.route.js")
const blogRoute = require("./routes/blog.route.js")
const commentRoute = require("./routes/comment.route.js")

// Import path module to handle file and directory paths
const path = require('path')

// Create an Express application instance
const app = express()

// Load environment variables (PORT, DB_URL, etc.)
dotenv.config()

// Connect to MongoDB database
connectDB()

// Define the server port (from .env or default to 3000)
const PORT = process.env.PORT || 3000

/* ===========================
   MIDDLEWARE SECTION
   =========================== */

// Middleware to parse incoming JSON data
// Allows reading req.body in POST/PUT requests
app.use(express.json())

// Middleware to parse cookies sent by the browser
// Required when using authentication with cookies
app.use(cookieParser())

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))

// CORS configuration to allow frontend access
// origin → frontend URL
// credentials → required for cookies & sessions
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/* ===========================
   ROUTES SECTION
   =========================== */

// Resolve the absolute path of the project root directory
const _dirname = path.resolve()

// User-related routes (login, register, profile, etc.)
app.use("/api/v1/user", userRoute)

// Blog-related routes (create, update, fetch blogs)
app.use("/api/v1/blog", blogRoute)

// Comment-related routes (add, delete, fetch comments)
app.use("/api/v1/comment", commentRoute)

/* ===========================
   PRODUCTION (FRONTEND SERVING)
   =========================== */

// Serve frontend static files (Vite / React build)
app.use(express.static(path.join(_dirname, "/frontend/dist")))

// Catch-all route to support React Router (SPA routing)
// If route not found in backend, send index.html

// app.get("*", (_, res) => {
//     res.sendFile(
//         path.resolve(_dirname, "frontend", "dist", "index.html")
//     )
// })

/* ===========================
   SERVER START
   =========================== */

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
})
