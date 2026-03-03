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



userSchema.pre("save" , async function (next) {
    if (!this.isModified("password")) {
        return ;
    }
    this.password = await bcrypt.hash(this.password, 10)
    
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

export const User = mongoose.model("User" , userSchema)