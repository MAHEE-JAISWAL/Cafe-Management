const express = require("express")
const {
    getAllMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
} = require("../controllers/menuController")
const authMiddleware = require("../middlewares/auth")

const router = express.Router()

// Public routes
router.get("/", getAllMenuItems)

// Protected routes (Manager only)
router.post("/", authMiddleware, createMenuItem)
router.put("/:id", authMiddleware, updateMenuItem)
router.delete("/:id", authMiddleware, deleteMenuItem)
router.patch("/:id/toggle", authMiddleware, toggleAvailability)

module.exports = router
