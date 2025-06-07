
"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import { api } from "../utils/api"
import toast from "react-hot-toast"
import { QRCodeCanvas } from "qrcode.react"
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    QrCode,
    BarChart3,
    Coffee,
    LogOut,
    DollarSign,
    ShoppingBag,
    Users,
} from "lucide-react"

const ManagerDashboard = () => {
    const { manager, logout } = useAuth()
    const [activeTab, setActiveTab] = useState("overview")
    const [menuItems, setMenuItems] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [qrCodes, setQrCodes] = useState([
        { id: "Table 1", value: `${window.location.origin}/menu?table=1` },
        { id: "Table 2", value: `${window.location.origin}/menu?table=2` },
        { id: "Table 3", value: `${window.location.origin}/menu?table=3` },
    ])
    const [editingQr, setEditingQr] = useState({ editing: false, value: "", index: null })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [menuResponse, ordersResponse] = await Promise.all([api.get("/menu"), api.get("/orders")])

            setMenuItems(menuResponse.data)
            setOrders(ordersResponse.data)
        } catch (error) {
            toast.error("Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }

    const toggleItemAvailability = async (itemId) => {
        try {
            await api.patch(`/menu/${itemId}/toggle`)
            toast.success("Item availability updated")
            fetchData()
        } catch (error) {
            toast.error("Failed to update item")
        }
    }

    const deleteMenuItem = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await api.delete(`/menu/${itemId}`)
                toast.success("Item deleted successfully")
                fetchData()
            } catch (error) {
                toast.error("Failed to delete item")
            }
        }
    }

    const generateQRCodes = () => {
        // This would typically generate QR codes for all tables
        toast.success("QR codes generated! (Feature to be implemented)")
    }

    // Calculate statistics
    const stats = {
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        totalOrders: orders.length,
        activeMenuItems: menuItems.filter((item) => item.available).length,
        pendingOrders: orders.filter((order) => order.status === "pending").length,
    }

    const tabs = [
        { id: "overview", name: "Overview", icon: BarChart3 },
        { id: "menu", name: "Menu Management", icon: Coffee },
        { id: "orders", name: "Orders", icon: ShoppingBag },
        { id: "qr-codes", name: "QR Codes", icon: QrCode },
    ]

    const handleStartEdit = (index) => {
        setEditingQr({
            editing: true,
            value: qrCodes[index].value,
            index,
        })
    }

    const handleCancelEdit = () => {
        setEditingQr({ editing: false, value: "", index: null })
    }

    const handleChangeEdit = (value) => {
        setEditingQr({ ...editingQr, value })
    }

    const handleSaveEdit = () => {
        const newQrCodes = [...qrCodes]
        newQrCodes[editingQr.index].value = editingQr.value
        setQrCodes(newQrCodes)
        setEditingQr({ editing: false, value: "", index: null })
        toast.success("QR code updated successfully")
    }

    const handleDeleteQr = (index) => {
        if (window.confirm("Are you sure you want to delete this QR code?")) {
            const newQrCodes = [...qrCodes]
            newQrCodes.splice(index, 1)
            setQrCodes(newQrCodes)
            toast.success("QR code deleted successfully")
        }
    }

    const handleDownloadQr = (qr, qrRef, qrStyle) => {
        if (!qrRef.current) return

        const canvas = qrRef.current.querySelector("canvas")
        if (!canvas) return

        // Create a temporary link element
        const link = document.createElement("a")
        link.download = `qr-${qr.id.replace(/\s+/g, "-").toLowerCase()}.png`
        link.href = canvas.toDataURL("image/png")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success(`QR code for ${qr.id} downloaded`)
    }

    const addNewQrCode = () => {
        const tableNumber = qrCodes.length + 1
        setQrCodes([
            ...qrCodes,
            { id: `Table ${tableNumber}`, value: `${window.location.origin}/menu?table=${tableNumber}` },
        ])
        toast.success(`QR code for Table ${tableNumber} created`)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Coffee className="h-8 w-8 text-orange-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Welcome, {manager?.username}</span>
                            <button
                                onClick={logout}
                                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {tab.name}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <DollarSign className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Coffee className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Active Menu Items</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.activeMenuItems}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Users className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Table
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.slice(0, 10).map((order) => (
                                            <tr key={order._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order._id.slice(-6)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.tableNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${order.totalAmount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : order.status === "preparing"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : order.status === "ready"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Management Tab */}
                {activeTab === "menu" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Menu Item
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {menuItems.map((item) => (
                                <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
                                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                            <span className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {item.available ? "Available" : "Unavailable"}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => toggleItemAvailability(item._id)}
                                                    className="p-2 text-gray-600 hover:text-gray-900"
                                                >
                                                    {item.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                                <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 hover:text-blue-900">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteMenuItem(item._id)}
                                                    className="p-2 text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h2>
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">#{order._id.slice(-6)}</div>
                                                        <div className="text-sm text-gray-500">Table {order.tableNumber}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{order.customerName || "Anonymous"}</div>
                                                    <div className="text-sm text-gray-500">{order.customerPhone || "No phone"}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${order.totalAmount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : order.status === "preparing"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : order.status === "ready"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* QR Codes Tab */}
                {activeTab === "qr-codes" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">QR Code Management</h2>
                            <button
                                onClick={addNewQrCode}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add New QR Code
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {qrCodes.map((qr, index) => (
                                <QRCard
                                    key={qr.id}
                                    qr={qr}
                                    editState={editingQr.index === index ? editingQr : {}}
                                    onStartEdit={() => handleStartEdit(index)}
                                    onCancelEdit={handleCancelEdit}
                                    onChangeEdit={handleChangeEdit}
                                    onSaveEdit={handleSaveEdit}
                                    onDelete={() => handleDeleteQr(index)}
                                    onDownload={handleDownloadQr}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const QRCard = ({ qr, editState = {}, onStartEdit, onCancelEdit, onChangeEdit, onSaveEdit, onDelete, onDownload }) => {
    const isEditing = editState.editing || false
    const value = editState.value || ""
    const qrRef = useRef(null)
    const [qrStyle, setQrStyle] = useState({
        fgColor: "#000000",
        bgColor: "#FFFFFF",
        includeMargin: true,
        size: 180, // Normal size that fits well in the card
        level: "H",
    })

    // QR style presets
    const stylePresets = [
        { name: "Classic", fgColor: "#000000", bgColor: "#FFFFFF" },
        { name: "Inverted", fgColor: "#FFFFFF", bgColor: "#000000" },
        { name: "Teal", fgColor: "#38B2AC", bgColor: "#FFFFFF" },
        { name: "Midnight", fgColor: "#2C5282", bgColor: "#EBF8FF" },
        { name: "Forest", fgColor: "#276749", bgColor: "#F0FFF4" },
    ]

    const applyStyle = (style) => {
        setQrStyle({
            ...qrStyle,
            fgColor: style.fgColor,
            bgColor: style.bgColor,
        })
    }

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:border-teal-500">
            <div className="p-4 border-b border-gray-700">
                <h3 className="font-medium text-gray-200">{qr.id}</h3>
            </div>

            <div className="p-5">
                <div className="flex flex-col items-center">
                    {/* QR Code */}
                    <div
                        className="p-4 rounded-md mb-5 transition-all duration-300"
                        style={{ backgroundColor: qrStyle.bgColor }}
                        ref={qrRef}
                    >
                        <QRCodeCanvas
                            value={qr.value}
                            size={qrStyle.size}
                            bgColor={qrStyle.bgColor}
                            fgColor={qrStyle.fgColor}
                            level={qrStyle.level}
                            includeMargin={qrStyle.includeMargin}
                            renderAs="canvas"
                        />
                    </div>

                    {/* QR Style Options */}
                    <div className="w-full mb-5">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {stylePresets.map((style, index) => (
                                <button
                                    key={index}
                                    className="w-6 h-6 rounded-full border border-gray-600 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    style={{ backgroundColor: style.bgColor }}
                                    onClick={() => applyStyle(style)}
                                    title={style.name}
                                >
                                    <div className="w-3 h-3 rounded-full mx-auto" style={{ backgroundColor: style.fgColor }}></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* QR Value or Edit Form */}
                    <div className="w-full">
                        {isEditing ? (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-gray-200"
                                    value={value}
                                    onChange={(e) => onChangeEdit(e.target.value)}
                                    placeholder="Enter QR code value"
                                />
                                <div className="flex justify-between gap-3">
                                    <button
                                        className="bg-teal-500 hover:bg-teal-600 text-gray-900 px-4 py-2 rounded-md transition-colors duration-200 font-medium w-full flex items-center justify-center"
                                        onClick={onSaveEdit}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-md transition-colors duration-200 font-medium w-full flex items-center justify-center"
                                        onClick={onCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-gray-900 p-3 rounded-md border border-gray-700 break-all">
                                    <p className="text-sm text-gray-400">{qr.value}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm flex items-center justify-center"
                                        onClick={() => onDownload(qr, qrRef, qrStyle)}
                                    >
                                        Download
                                    </button>
                                    <button
                                        className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-2 rounded-md transition-colors duration-200 text-sm flex items-center justify-center"
                                        onClick={onStartEdit}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-2 rounded-md transition-colors duration-200 text-sm flex items-center justify-center"
                                        onClick={onDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerDashboard
