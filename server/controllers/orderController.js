const Order = require("../models/Order")
const Menu = require("../models/Menu")

// Create new order
const createOrder = async (req, res) => {
    try {
        const { tableNumber, items, customerName, customerPhone, specialInstructions } = req.body

        // Calculate total amount and validate items
        let totalAmount = 0
        const orderItems = []

        for (const item of items) {
            const menuItem = await Menu.findById(item.menuItem)
            if (!menuItem) {
                return res.status(400).json({ message: `Menu item not found: ${item.menuItem}` })
            }
            if (!menuItem.available) {
                return res.status(400).json({ message: `Item not available: ${menuItem.name}` })
            }

            const itemTotal = menuItem.price * item.quantity
            totalAmount += itemTotal

            orderItems.push({
                menuItem: item.menuItem,
                quantity: item.quantity,
                price: menuItem.price,
            })
        }

        const order = new Order({
            tableNumber,
            items: orderItems,
            totalAmount,
            customerName,
            customerPhone,
            specialInstructions,
        })

        await order.save()
        await order.populate("items.menuItem")

        res.status(201).json({
            message: "Order placed successfully",
            order,
        })
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message })
    }
}

// Get all orders (for kitchen dashboard)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("items.menuItem").sort({ createdAt: -1 })

        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message })
    }
}

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate("items.menuItem")

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        res.json({
            message: "Order status updated successfully",
            order,
        })
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message })
    }
}

// Get orders by table
const getOrdersByTable = async (req, res) => {
    try {
        const { tableNumber } = req.params
        const orders = await Order.find({ tableNumber }).populate("items.menuItem").sort({ createdAt: -1 })

        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message })
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    getOrdersByTable,
}
