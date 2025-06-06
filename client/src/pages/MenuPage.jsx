import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { api } from "../utils/api"
import toast from "react-hot-toast"
import MenuCard from "../components/Menu/MenuCard"
import OrderSummary from "../components/Order/OrderSummary"
import { ShoppingCart, Users } from "lucide-react"

const MenuPage = () => {
  const [searchParams] = useSearchParams()
  const tableNumber = searchParams.get("table") || "1"

  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCart, setShowCart] = useState(false)

  const categories = [
    { id: "all", name: "All Items" },
    { id: "appetizers", name: "Appetizers" },
    { id: "main-course", name: "Main Course" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
    { id: "specials", name: "Specials" },
  ]

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await api.get("/menu")
      setMenuItems(response.data)
    } catch (error) {
      toast.error("Failed to load menu items")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (menuItem) => {
    const existingItem = cart.find((item) => item._id === menuItem._id)

    if (existingItem) {
      setCart(cart.map((item) => (item._id === menuItem._id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...menuItem, quantity: 1 }])
    }

    toast.success(`${menuItem.name} added to cart`)
  }

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      setCart(cart.filter((item) => item._id !== itemId))
    } else {
      setCart(cart.map((item) => (item._id === itemId ? { ...item, quantity } : item)))
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const filteredMenuItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

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
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Cafe Menu</h1>
              <div className="ml-4 flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-1" />
                <span>Table {tableNumber}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCart(true)}
              className="relative bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({cart.length})
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${selectedCategory === category.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <MenuCard key={item._id} item={item} onAddToCart={addToCart} />
          ))}
        </div>

        {filteredMenuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        )}
      </main>

      {/* Order Summary Modal */}
      {showCart && (
        <OrderSummary
          cart={cart}
          tableNumber={tableNumber}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateCartQuantity}
          totalAmount={getTotalAmount()}
        />
      )}
    </div>
  )
}

export default MenuPage
