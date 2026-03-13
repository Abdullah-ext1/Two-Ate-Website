import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionPosition = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MongoDB connected  ${connectionPosition.connection.host}`);
        console.log("Connected DB:", mongoose.connection.name)
        
    } catch (error) {
        console.log("ERROR : MongoDB connection failed!!" , error.message);
        process.exit(1)
    }
}

export {connectDB}