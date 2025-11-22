const { User } = require("../models/user.model");
const bcrypt  = require('bcryptjs')

// register controller
const register = async (req, res) => {
    try {
        // take data of user
        const { firstName, lastName, email, password } = req.body

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check email is correct or not
        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }

        // check password minimum length is 6
        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"Password must be atleast 6 character"
            })
        }

        // check email is already exist or not

        const existingUserByEmail = await User.findOne({
            email:email
        })

        if(existingUserByEmail){
            return res.status(400).json({
                success:false,
                message:"Email already exists"
            })
        }

        // if the user doesnot exist then hash the new user password which will be stored in DB
         const hashPassword = await bcrypt.hash(password,10)


        // if the user is not existed then create the user 
       await User.create({
        firstName,
        lastName,
        email,
        password:hashPassword
       })

       return res.status(201).json({
        success:true,
        message:"Account created successfully"
       })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

// login user
const login = async(req,res)=>{
    try {
        const {email , password} = req.body
        
        
    } catch (error) {
      console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}

module.exports = {
    register
}