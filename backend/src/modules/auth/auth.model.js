import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true 
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        trim: true,
        select: false //this feild excluded when fetch user
    },
    role: {
        type: String,
        enum: ["user" , "admin"],
        default: "user"
    },
    refreshToken: {
        type: String
    }
},{ timestamps: true })


//Password Hashing
userSchema.pre("save" , async function (next) {
    if (!this.isModified("password")) {
        return ;
    }
    this.password = await bcrypt.hash(this.password, 10)
    
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

//Access Token And Refresh Token Generation

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema)