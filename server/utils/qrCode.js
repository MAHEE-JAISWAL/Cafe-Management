const QRCode = require("qrcode")

const generateQRCode = async (tableNumber, baseUrl) => {
    try {
        const menuUrl = `${baseUrl}/menu?table=${tableNumber}`
        const qrCodeDataURL = await QRCode.toDataURL(menuUrl, {
            width: 300,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
        })

        return {
            url: menuUrl,
            qrCode: qrCodeDataURL,
        }
    } catch (error) {
        throw new Error("QR Code generation failed")
    }
}

const generateMultipleQRCodes = async (numberOfTables, baseUrl) => {
    const qrCodes = []

    for (let i = 1; i <= numberOfTables; i++) {
        const qrData = await generateQRCode(i, baseUrl)
        qrCodes.push({
            tableNumber: i,
            ...qrData,
        })
    }

    return qrCodes
}

module.exports = {
    generateQRCode,
    generateMultipleQRCodes,
}
