import ApiError from "../../utils/apiError.js";
import { User } from "./auth.model.js";
import { ApiResponse } from "../../utils/apiResponce.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

//generating user access and refresh token

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
    
        if (!user) {
            throw new ApiError(400 , 'User id not found')
        }
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
    
        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500 , error.message || "Error while generatig Access Token or Refresh Token")
    }
}

//Register User

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

        const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const option = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken" , accessToken , option)
        .cookie("refreshToken" , refreshToken , option)
        .json(
            new ApiResponse(
                200,
                {user: loggedInUser ,accessToken, refreshToken},
                "User Loggedin Successfully"
            )
        )
}

//Logout

const logout = asyncHandler(async (req , res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken: undefined
            }
        },{
            new: true
        }
        
    )
     const option = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken" , option)
        .clearCookie("refreshToken" , option)
        .json(
            new ApiResponse(
                200,
                {},
                "User LoggedOut Successfully"
            )
        )
})

//Refreh access token

const refreshAccessToken = asyncHandler(async (req , res) => {
    const incomingRefToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefToken) {
        throw new ApiError(400 , "Unauthorised Request")
    }

    const verifyToken = jwt.verify(incomingRefToken , process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(verifyToken._id)
    if (!user) {
        throw new ApiError(400 , "Invalid User Request")
    }
    
    if (incomingRefToken !== user?.refreshToken) {
        throw new ApiError(400 , "Token Expired")
    }

    const {accessToken , refreshToken} = generateAccessAndRefreshToken(user._id)

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken)
    .cookie("refreshToken" , refreshToken)
    .json(
        new ApiResponse(
            200,
            {
                accessToken , refreshToken
            },
            "accessToken Refreshed Successfully"
        )
    )


})

//ChangePassword

const ChangePassword = asyncHandler(async (req , res) => {
    const {oldPassword , newPassword} = req.body
    const user = await User.findById(req.user?._id).select("+password")
    const passcheck = await user.isPasswordCorrect(oldPassword)

    if (!passcheck) {
        throw new ApiError(400 , "Entered Password Is Wrong")
    }
    user.password = newPassword
    user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password Changed Successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logout,
    refreshAccessToken,
    ChangePassword

}