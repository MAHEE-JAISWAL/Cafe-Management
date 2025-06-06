const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
})

const orderSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: Number,
            required: true,
            min: 1,
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["pending", "preparing", "ready", "served", "cancelled"],
            default: "pending",
        },
        customerName: {
            type: String,
            trim: true,
        },
        customerPhone: {
            type: String,
            trim: true,
        },
        specialInstructions: {
            type: String,
            trim: true,
        },
        estimatedTime: {
            type: Number, // minutes
            default: 20,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model("Order", orderSchema)
