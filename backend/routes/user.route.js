const express = require('express')
const { register, login, logout } = require('../controllers/user.controller.js')

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout) //TODO : a logged in user is able to logout therefore use a middleware

module.exports = router