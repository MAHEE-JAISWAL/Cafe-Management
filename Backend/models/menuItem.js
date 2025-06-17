import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String, // URL of the uploaded image
      required: true,
    },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model("MenuItem", MenuItemSchema);