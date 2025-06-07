import mongoose from "mongoose";


const managerSchema = new mongoose.Schema({
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    }

});

export const Manager = mongoose.model("Manager", managerSchema);