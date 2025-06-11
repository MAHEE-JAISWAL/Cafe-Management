import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../utils/api"
import toast from "react-hot-toast"
import { Coffee, LogOut } from "lucide-react"
import DashboardOverview from "./overview"
import MenuManagement from "./menu-management"
import OrderManagement from "./order-management"
import QRCodeManagement from "./qr-code-management"

const ManagerDashboard = () => {
    const { manager, logout } = useAuth()
    const [activeTab, setActiveTab] = useState("overview")
    const [menuItems, setMenuItems] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

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

    // Calculate statistics
    const stats = {
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        totalOrders: orders.length,
        activeMenuItems: menuItems.filter((item) => item.available).length,
        pendingOrders: orders.filter((order) => order.status === "pending").length,
    }

    const tabs = [
        { id: "overview", name: "Overview", icon: "BarChart3" },
        { id: "menu", name: "Menu Management", icon: "Coffee" },
        { id: "orders", name: "Orders", icon: "ShoppingBag" },
        { id: "qr-codes", name: "QR Codes", icon: "QrCode" },
    ]

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
                            const IconComponent = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <span className="h-4 w-4 mr-2">{/* Icon will be rendered in TabIcon component */}</span>
                                    {tab.name}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && <DashboardOverview stats={stats} orders={orders} />}

                {activeTab === "menu" && (
                    <MenuManagement
                        menuItems={menuItems}
                        toggleItemAvailability={toggleItemAvailability}
                        deleteMenuItem={deleteMenuItem}
                        setEditingItem={setEditingItem}
                        setShowAddModal={setShowAddModal}
                        showAddModal={showAddModal}
                        editingItem={editingItem}
                    />
                )}

                {activeTab === "orders" && <OrderManagement orders={orders} />}

                {activeTab === "qr-codes" && <QRCodeManagement />}
            </div>
        </div>
    )
}

export default ManagerDashboard

