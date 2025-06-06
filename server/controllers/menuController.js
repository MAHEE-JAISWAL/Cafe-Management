const Menu = require("../models/Menu")
const { uploadImage } = require("../config/cloudinary")

// Get all menu items
const getAllMenuItems = async (req, res) => {
    try {
        const { category } = req.query
        const filter = category ? { category, available: true } : { available: true }

        const menuItems = await Menu.find(filter).sort({ category: 1, name: 1 })
        res.json(menuItems)
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu items", error: error.message })
    }
}

// Create new menu item (Manager only)
const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, preparationTime } = req.body
        const { image } = req.files || {}

        if (!image) {
            return res.status(400).json({ message: "Image is required" })
        }

        // Upload image to Cloudinary
        const uploadResult = await uploadImage(image.tempFilePath)

        const menuItem = new Menu({
            name,
            description,
            price: Number.parseFloat(price),
            category,
            image: uploadResult.secure_url,
            preparationTime: preparationTime ? Number.parseInt(preparationTime) : 15,
        })

        await menuItem.save()

        res.status(201).json({
            message: "Menu item created successfully",
            menuItem,
        })
    } catch (error) {
        res.status(500).json({ message: "Error creating menu item", error: error.message })
    }
}

// Update menu item
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        // If new image is uploaded
        if (req.files && req.files.image) {
            const uploadResult = await uploadImage(req.files.image.tempFilePath)
            updates.image = uploadResult.secure_url
        }

        const menuItem = await Menu.findByIdAndUpdate(id, updates, { new: true })

        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" })
        }

        res.json({
            message: "Menu item updated successfully",
            menuItem,
        })
    } catch (error) {
        res.status(500).json({ message: "Error updating menu item", error: error.message })
    }
}

// Delete menu item
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params

        const menuItem = await Menu.findByIdAndDelete(id)

        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" })
        }

        res.json({ message: "Menu item deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting menu item", error: error.message })
    }
}

// Toggle menu item availability
const toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params

        const menuItem = await Menu.findById(id)
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" })
        }

        menuItem.available = !menuItem.available
        await menuItem.save()

        res.json({
            message: `Menu item ${menuItem.available ? "enabled" : "disabled"} successfully`,
            menuItem,
        })
    } catch (error) {
        res.status(500).json({ message: "Error updating availability", error: error.message })
    }
}

module.exports = {
    getAllMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
}
