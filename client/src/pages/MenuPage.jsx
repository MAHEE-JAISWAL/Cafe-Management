import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { api } from "../utils/api"
import toast from "react-hot-toast"
import MenuCard from "../components/Menu/MenuCard"
import OrderSummary from "../components/Order/OrderSummary"
import { ShoppingCart, Users } from "lucide-react"

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCart, setShowCart] = useState(false)
  const tableNumber = "5" // Simulated table number

  const categories = [
    { id: "all", name: "All Items" },
    { id: "appetizers", name: "Appetizers" },
    { id: "main-course", name: "Main Course" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
    { id: "specials", name: "Specials" },
  ]

  // Sample menu data
  const sampleMenuItems = [
    {
      _id: "1",
      name: "Truffle Mushroom Risotto",
      description: "Creamy arborio rice with wild mushrooms, truffle oil, and parmesan cheese",
      price: 24.99,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=250&fit=crop",
      rating: 4.8,
      prepTime: "25-30",
      isSpecial: false
    },
    {
      _id: "2",
      name: "Crispy Calamari",
      description: "Golden fried squid rings served with marinara sauce and lemon wedges",
      price: 12.99,
      category: "appetizers",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=250&fit=crop",
      rating: 4.6,
      prepTime: "10-15",
      isSpecial: false
    },
    {
      _id: "3",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center, served with vanilla ice cream",
      price: 8.99,
      category: "desserts",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=250&fit=crop",
      rating: 4.9,
      prepTime: "12-15",
      isSpecial: false
    },
    {
      _id: "4",
      name: "Craft Beer Selection",
      description: "Choice of local IPA, wheat beer, or seasonal special on tap",
      price: 6.99,
      category: "beverages",
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=250&fit=crop",
      rating: 4.4,
      prepTime: "2-5",
      isSpecial: false
    },
    {
      _id: "5",
      name: "Chef's Special Salmon",
      description: "Pan-seared Atlantic salmon with quinoa pilaf and seasonal vegetables",
      price: 28.99,
      category: "specials",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=250&fit=crop",
      rating: 4.7,
      prepTime: "20-25",
      isSpecial: true
    },
    {
      _id: "6",
      name: "Mediterranean Flatbread",
      description: "Thin crust topped with feta, olives, tomatoes, and fresh herbs",
      price: 14.99,
      category: "appetizers",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop",
      rating: 4.5,
      prepTime: "15-18",
      isSpecial: false
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMenuItems(sampleMenuItems)
      setLoading(false)
    }, 1000)
  }, [])

  const addToCart = (menuItem) => {
    const existingItem = cart.find((item) => item._id === menuItem._id)

    if (existingItem) {
      setCart(cart.map((item) => (item._id === menuItem._id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...menuItem, quantity: 1 }])
    }

    // Show success message
    const successDiv = document.createElement('div')
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50'
    successDiv.textContent = `${menuItem.name} added to cart`
    document.body.appendChild(successDiv)
    setTimeout(() => document.body.removeChild(successDiv), 2000)
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
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${selectedCategory === category.id
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
