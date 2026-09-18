import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import DataURIParser from "datauri/parser.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";


// register function 
export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        // check whether user is already exist or not
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "user already exist with this email.",
                success: false,
            })
        }
        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
        // create new user in database
        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });
        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        })

    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
// login function 
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "something is missing",
                success: false
            });
        };
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        };
        // check role is correct or not
        if (role != user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role",
                success: false
            });
        };
        // generate token
        const tokenData = {
            userId: user._id
        }

        const userData = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).json({
        message: `welcome back ${user.fullName}`,
        token,            
        userData,
        success: true
        });


    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
// logout function 
export const logout = async (req, res) => {
    try {
        return res.status(200).json({
        message: "logged out successfully",
        success: true
        });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
// update profile  
export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, bio, skills } = req.body || {};
        const file = req.file;

        // cloudinary ayega idhar


        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: "raw",
            public_id: `resume_${Date.now()}`,
            use_filename: true,
            unique_filename: false,
            format: "pdf",
            type: "upload" // ✅ ensure it is public (not private/authenticated)
        });



        const userId = req.id;// middlewares authentication
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "user not found",
                success: false
            })
        }
        // updating data 
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        // For profile object
        if (!user.profile) user.profile = {};

        if (bio) user.profile.bio = bio;

        if (skills) {
            const skillsArray = skills.split(",");
            user.profile.skills = skillsArray;
        }


        // If file upload logic is added later, handle it here
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // save the original file name

        }

        await user.save();


        // resumae comes later here...

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({
            message: "Profile updated succesfully .",
            user,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}