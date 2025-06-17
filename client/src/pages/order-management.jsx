"use client"

import { useState } from "react"
import { Clock, User, DollarSign, Hash } from "lucide-react"

const OrderManagement = ({ orders, onUpdateOrderStatus }) => {
    const [updatingOrder, setUpdatingOrder] = useState(null)

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (!onUpdateOrderStatus) return

        setUpdatingOrder(orderId)
        try {
            await onUpdateOrderStatus(orderId, newStatus)
        } catch (error) {
            console.error("Failed to update order status:", error)
        } finally {
            setUpdatingOrder(null)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "preparing":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "ready":
                return "bg-green-100 text-green-800 border-green-200"
            case "completed":
                return "bg-gray-100 text-gray-800 border-gray-200"
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case "pending":
                return "preparing"
            case "preparing":
                return "ready"
            case "ready":
                return "completed"
            default:
                return null
        }
    }

    if (!orders || orders.length === 0) {
        return (
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h2>
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="text-gray-400 mb-4">
                        <Clock className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500">Orders will appear here when customers place them.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                <div className="text-sm text-gray-500">Total Orders: {orders.length}</div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <Hash className="h-4 w-4 mr-1" />
                                        Order Details
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        Customer
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        Amount
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        Time
                                    </div>
                                </th>
                                {onUpdateOrderStatus && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => {
                                const nextStatus = getNextStatus(order.status)
                                const isUpdating = updatingOrder === order._id

                                return (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">#{order._id?.slice(-6) || "N/A"}</div>
                                                <div className="text-sm text-gray-500">Table {order.tableNumber || "N/A"}</div>
                                                {order.items && order.items.length > 0 && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{order.customerName || "Anonymous"}</div>
                                            <div className="text-sm text-gray-500">{order.customerPhone || "No phone"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                ${order.totalAmount?.toFixed(2) || "0.00"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}
                                            >
                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Unknown"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                                        </td>
                                        {onUpdateOrderStatus && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {nextStatus && order.status !== "completed" && order.status !== "cancelled" ? (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                                        disabled={isUpdating}
                                                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white transition-colors ${isUpdating
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                                            }`}
                                                    >
                                                        {isUpdating ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            `Mark as ${nextStatus}`
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No action</span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                {["pending", "preparing", "ready", "completed"].map((status) => {
                    const count = orders.filter((order) => order.status === status).length
                    return (
                        <div key={status} className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status).split(" ")[0]}`}></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OrderManagement
