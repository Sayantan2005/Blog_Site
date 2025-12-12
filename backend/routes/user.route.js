const express = require('express')
const { register, login, logout, updateProfile, getAllUsers } = require('../controllers/user.controller.js')
const { isAuthenticated } = require('../middleware/isAuthenticated.js')
const { singleUpload } = require('../middleware/multer.js')

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout) //TODO : a logged in user is able to logout therefore use a middleware

// secured route --> authenticated user (isAuthenticated middleware check the user authenticity) can update there profile 
router.route("/profile/update").put(isAuthenticated,singleUpload,updateProfile)

// this is not use theisAuthenticated middleware so it is not only for logged in user 
router.route("/all-users").get(getAllUsers)


module.exports = router