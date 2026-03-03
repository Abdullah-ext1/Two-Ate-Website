import mongoose from "mongoose";
import ApiError from "../../utils/apiError.js";
import { User } from "./auth.model.js";
import { ApiResponse } from "../../utils/apiResponce.js";

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

    return res.status(201).json(
        new ApiResponse(
            200,
            {createdUser},
            "User Created Successfully"
        )
    )

}

//Login
    const loginUser = async(req , res) => {
        const {fullName , email , password } = req.body
    
        if(!(password || email)){
            throw new ApiError(400 , "Email and Password Is Required")
        }
    
        const user = await User.findOne({email}).select("+password")

        if (!user) {
            throw new ApiError(404 ,"User Does Not Found")
        }

        const checkPassword = await user.isPasswordCorrect(password)

        if (!checkPassword) {
            throw new ApiError(401 , "Enter A Valid Password")
        }
        
        const removepass = await User.findById(user._id).select("-password -refreshToken")

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "User Loggedin Successfully"
            )
        )
}
export {
    registerUser,
    loginUser

}