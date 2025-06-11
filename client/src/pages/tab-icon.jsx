"use client"

import {
    BarChart3,
    Coffee,
    ShoppingBag,
    QrCode,
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    DollarSign,
    Users,
} from "lucide-react"

interface TabIconProps {
    name: string
    className?: string
}

const TabIcon = ({ name, className = "h-4 w-4" }: TabIconProps) => {
    switch (name) {
        case "BarChart3":
            return <BarChart3 className={className} />
        case "Coffee":
            return <Coffee className={className} />
        case "ShoppingBag":
            return <ShoppingBag className={className} />
        case "QrCode":
            return <QrCode className={className} />
        case "Plus":
            return <Plus className={className} />
        case "Edit":
            return <Edit className={className} />
        case "Trash2":
            return <Trash2 className={className} />
        case "Eye":
            return <Eye className={className} />
        case "EyeOff":
            return <EyeOff className={className} />
        case "DollarSign":
            return <DollarSign className={className} />
        case "Users":
            return <Users className={className} />
        default:
            return null
    }
}

export default TabIcon
