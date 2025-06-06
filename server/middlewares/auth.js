const jwt = require("jsonwebtoken")
const Manager = require("../models/Manager")

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
        const manager = await Manager.findById(decoded.id).select("-password")

        if (!manager) {
            return res.status(401).json({ message: "Token is not valid" })
        }

        req.manager = manager
        next()
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" })
    }
}

module.exports = authMiddleware
