import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();  

export const connectDB= async() => {
    try {
        await mongoose.connect(process.env.Mongo_URL);
        console.log('MongoDB connected successfully');

     } catch (error) {
        console.log('MongoDB connection failed:', error.message);
        process.exit(1); // Exit the process with failure
    }
}