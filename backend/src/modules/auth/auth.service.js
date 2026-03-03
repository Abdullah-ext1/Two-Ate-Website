import mongoose from "mongoose";
import ApiError from "../../utils/apiError.js";
import { User } from "./auth.model.js";

const registerUser = async (req , res) => {

    const {fullName , email , password} = req.body
    if(
        [fullName , email , password].some((feild) => feild?.trim() === "" )
    ){
        throw new ApiError(400 , "All Feilds Are Required")
    }

    if (password.length < 6) {
        throw new ApiError(400 , "Password Must Be At Least 6 characters")
    }
    if (!email.includes("@")) {
        throw new ApiError(400 , "Invalid Email")
    }

    const existingUser = await User.findOne({email})

    if (existingUser) {
        throw new ApiError(409 , "User With This Email Already Exists")
    }

    const user = await User.create({
        fullName,
        email,
        password
    })

    if (!user) {
        throw new ApiError(500 , "Failed To Create User")
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500 , "Failed To Create User")
    }

    return res.status(201).json({
        success: true,
        user: createdUser,
        message: "User Created Successfully"
    })

}

export {registerUser}