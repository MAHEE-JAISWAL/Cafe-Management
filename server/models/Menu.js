const mongoose = require("mongoose")

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            enum: ["appetizers", "main-course", "desserts", "beverages", "specials"],
        },
        image: {
            type: String,
            required: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
        preparationTime: {
            type: Number,
            default: 15, // minutes
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model("Menu", menuItemSchema)
