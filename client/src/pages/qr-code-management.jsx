"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"
import QRCard from "./qr-card"

const QRCodeManagement = () => {
    const [qrCodes, setQrCodes] = useState([
        { id: "Table 1", value: `${window.location.origin}/menu?table=1` },
        { id: "Table 2", value: `${window.location.origin}/menu?table=2` },
        { id: "Table 3", value: `${window.location.origin}/menu?table=3` },
    ])
    const [editingQr, setEditingQr] = useState({ editing: false, value: "", index: null })

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

    return (
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
    )
}

export default QRCodeManagement
