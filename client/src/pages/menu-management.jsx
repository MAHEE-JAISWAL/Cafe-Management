import { useState } from "react"
import { Plus, Edit, Trash2, Eye, EyeOff, X, Upload } from "lucide-react"

const MenuManagement = ({
    menuItems,
    toggleItemAvailability,
    deleteMenuItem,
    setEditingItem,
    setShowAddModal,
    showAddModal,
    editingItem,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        available: true,
        image: null,
    })
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const categories = ["Appetizers", "Main Course", "Desserts", "Beverages", "Salads", "Soups", "Sides"]

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }))

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Create FormData for file upload
            const submitData = new FormData()
            submitData.append("name", formData.name)
            submitData.append("description", formData.description)
            submitData.append("price", Number.parseFloat(formData.price))
            submitData.append("category", formData.category)
            submitData.append("available", formData.available)

            if (formData.image) {
                submitData.append("image", formData.image)
            }

            // Here you would typically make an API call to add the menu item
            console.log("Submitting menu item:", Object.fromEntries(submitData))

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Reset form and close modal
            resetForm()
            setShowAddModal(false)

            // You might want to refresh the menu items here
            // await fetchMenuItems()
        } catch (error) {
            console.error("Error adding menu item:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            available: true,
            image: null,
        })
        setImagePreview(null)
    }

    const closeModal = () => {
        resetForm()
        setShowAddModal(false)
    }

    return (
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
                                    <button onClick={() => deleteMenuItem(item._id)} className="p-2 text-red-600 hover:text-red-900">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Menu Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Menu Item</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Menu Item Image</label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview || "/placeholder.svg"}
                                                        alt="Preview"
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                        <p className="text-sm text-gray-500">Click to upload image</p>
                                                    </>
                                                )}
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null)
                                                setFormData((prev) => ({ ...prev, image: null }))
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Name and Price Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Enter item name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Enter item description"
                                />
                            </div>

                            {/* Availability */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="available"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                                    Available for ordering
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Menu Item"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MenuManagement
