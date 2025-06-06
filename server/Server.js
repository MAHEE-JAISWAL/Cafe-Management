const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Import routes
const orderRoutes = require("./routes/orderRoutes")
const menuRoutes = require("./routes/menuRoutes")
const managerRoutes = require("./routes/managerRoutes")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connection
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cafe-management", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/orders", orderRoutes)
app.use("/api/menu", menuRoutes)
app.use("/api/manager", managerRoutes)

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
