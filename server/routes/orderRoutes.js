const express = require("express")
const { createOrder, getAllOrders, updateOrderStatus, getOrdersByTable } = require("../controllers/orderController")

const router = express.Router()

// Public routes
router.post("/", createOrder)
router.get("/", getAllOrders)
router.get("/table/:tableNumber", getOrdersByTable)
router.patch("/:orderId/status", updateOrderStatus)

module.exports = router
