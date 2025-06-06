const express = require("express")
const { loginManager, createManager, getManagerProfile } = require("../controllers/managerController")
const authMiddleware = require("../middlewares/auth")

const router = express.Router()

// Public routes
router.post("/login", loginManager)
router.post("/register", createManager)

// Protected routes
router.get("/profile", authMiddleware, getManagerProfile)

module.exports = router
