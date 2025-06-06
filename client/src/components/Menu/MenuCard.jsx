import { Clock, Plus } from "lucide-react"

const MenuCard = ({ item, onAddToCart }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-9">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{item.preparationTime} min</span>
                    </div>

                    <button
                        onClick={() => onAddToCart(item)}
                        disabled={!item.available}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${item.available
                                ? "bg-orange-600 text-white hover:bg-orange-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        {item.available ? "Add to Cart" : "Unavailable"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MenuCard
