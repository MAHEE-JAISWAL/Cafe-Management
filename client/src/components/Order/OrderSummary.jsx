import { useState } from "react"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { api } from "../../utils/api"
import toast from "react-hot-toast"

const OrderSummary = ({ cart, tableNumber, onClose, onUpdateQuantity, totalAmount }) => {
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        specialInstructions: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmitOrder = async () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty")
            return
        }

        setIsSubmitting(true)

        try {
            const orderData = {
                tableNumber: Number.parseInt(tableNumber),
                items: cart.map((item) => ({
                    menuItem: item._id,
                    quantity: item.quantity,
                })),
                customerName: customerInfo.name,
                customerPhone: customerInfo.phone,
                specialInstructions: customerInfo.specialInstructions,
            }

            await api.post("/orders", orderData)

            toast.success("Order placed successfully!")
            onClose()

            // Clear cart (you might want to lift this state up)
            window.location.reload()
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        Order Summary
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[60vh]">
                    {/* Cart Items */}
                    <div className="p-4">
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Table {tableNumber}</p>
                        </div>

                        {cart.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item._id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                                        <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />

                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{item.name}</h4>
                                            <p className="text-orange-600 font-semibold">${item.price.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>

                                            <span className="w-8 text-center font-medium">{item.quantity}</span>

                                            <button
                                                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Customer Information */}
                        {cart.length > 0 && (
                            <div className="mt-6 space-y-4">
                                <h3 className="font-medium text-gray-900">Customer Information (Optional)</h3>

                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone number"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />

                                <textarea
                                    placeholder="Special instructions (optional)"
                                    value={customerInfo.specialInstructions}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, specialInstructions: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t p-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-xl font-bold text-orange-600">${totalAmount.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleSubmitOrder}
                            disabled={isSubmitting}
                            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Placing Order..." : "Place Order"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderSummary
