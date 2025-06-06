const Manager = require("../models/Manager")
const jwt = require("jsonwebtoken")

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "30d",
    })
}

// Manager login
const loginManager = async (req, res) => {
    try {
        const { username, password } = req.body

        // Find manager by username
        const manager = await Manager.findOne({ username })
        if (!manager) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // Check password
        const isPasswordValid = await manager.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // Generate token
        const token = generateToken(manager._id)

        res.json({
            message: "Login successful",
            token,
            manager: {
                id: manager._id,
                username: manager.username,
                email: manager.email,
                role: manager.role,
            },
        })
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message })
    }
}

// Create manager account (for initial setup)
const createManager = async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        // Check if manager already exists
        const existingManager = await Manager.findOne({
            $or: [{ username }, { email }],
        })

        if (existingManager) {
            return res.status(400).json({ message: "Manager already exists" })
        }

        const manager = new Manager({
            username,
            email,
            password,
            role: role || "manager",
        })

        await manager.save()

        const token = generateToken(manager._id)

        res.status(201).json({
            message: "Manager created successfully",
            token,
            manager: {
                id: manager._id,
                username: manager.username,
                email: manager.email,
                role: manager.role,
            },
        })
    } catch (error) {
        res.status(500).json({ message: "Error creating manager", error: error.message })
    }
}

// Get manager profile
const getManagerProfile = async (req, res) => {
    try {
        const manager = await Manager.findById(req.manager.id).select("-password")
        res.json(manager)
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message })
    }
}

module.exports = {
    loginManager,
    createManager,
    getManagerProfile,
}
