import mongoose from "mongoose";
import { DB_Name } from "../../constant.js";

const connectDB = async () => {
    try {
        const connectionPosition = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`MongoDB connected  ${connectionPosition.connection.host}`);
        
    } catch (error) {
        console.log("ERROR : MongoDB connection failed!!" , error.message);
        process.exit(1)
    }
}

export {connectDB}