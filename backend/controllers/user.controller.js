const { User } = require("../models/user.model");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { getDataUri } = require("../utils/dataUri");
const { cloudinary } = require("../utils/cloudinary");

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
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 6 character"
            })
        }

        // check email is already exist or not

        const existingUserByEmail = await User.findOne({
            email: email
        })

        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        // if the user doesnot exist then hash the new user password which will be stored in DB
        const hashPassword = await bcrypt.hash(password, 10)


        // if the user is not existed then create the user 
        await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        })

        return res.status(201).json({
            success: true,
            message: "Account created successfully"
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
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // find email is exist or not
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }

        // if the user registered then check password correct or not 

        const isPasswordValid = await bcrypt.compare(password, user.password) //password --> which i sent in input field
        // user.password --> the password which is stored in DB

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "invalid Credentials"
            })
        }

        // If password is valid then generate a token and set it to cookies ---> jab tak token alive rahega tab tak tum login rahoge and when the token expire you need to relogin it 
        const token = await jwt.sign({
            userId: user._id
        },
            process.env.SECRET_KEY,
            { expiresIn: "1d" })

        // set the token in cookies
        return res
            .status(200)
            .cookie(
                "token",
                token,
                //  options
                {
                    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
                    httpOnly: true, // Not httpsOnly — proper property name
                    sameSite: "strict",
                })
            .json({
                success: true,
                message: `Welcome back ${user.firstName}`,
                user,
            });



    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}

// logout user
const logout = async (req, res) => {
    try {
        // ✔ Logout Route
        // ✔ Clear the token cookie so user is logged out
        // ✔ Send success response
        return res
            .status(200)
            .cookie("token", "", {
                maxAge: 0,          // Cookie expires immediately → removed from browser
                httpOnly: true,     // Same security as login cookie
                secure: true,       // Use only with HTTPS in production
                sameSite: "strict", // Prevent CSRF
            })
            .json({
                success: true,
                message: "Logout Successfully", // Inform user logout done
            });

    } catch (error) {
        console.log(error)
    }
}

// update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {
            firstName,
            lastName,
            occupation,
            bio,
            instagram,
            facebook,
            linkedin,
            github
        } = req.body;

        const file = req.file;

        let cloudResponse = null;

        // Upload ONLY if the user has sent a file
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        // Fetch user
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Updating data
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (occupation) user.occupation = occupation;
        if (instagram) user.instagram = instagram;
        if (facebook) user.facebook = facebook;
        if (linkedin) user.linkedin = linkedin;
        if (github) user.github = github;
        if (bio) user.bio = bio;

        // Only update photoURL if image file exists
        if (cloudResponse) {
            user.photoURL = cloudResponse.secure_url;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update profile",
            success: false
        });
    }
};




module.exports = {
    register,
    login,
    logout,
    updateProfile
}