import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [manager, setManager] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("managerToken")
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`
            fetchManagerProfile()
        } else {
            setLoading(false)
        }
    }, [])

    const fetchManagerProfile = async () => {
        try {
            const response = await api.get("/manager/profile")
            setManager(response.data)
        } catch (error) {
            localStorage.removeItem("managerToken")
            delete api.defaults.headers.common["Authorization"]
        } finally {
            setLoading(false)
        }
    }

    const login = async (username, password) => {
        try {
            const response = await api.post("/manager/login", { username, password })
            const { token, manager } = response.data

            localStorage.setItem("managerToken", token)
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`
            setManager(manager)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Login failed",
            }
        }
    }

    const logout = () => {
        localStorage.removeItem("managerToken")
        delete api.defaults.headers.common["Authorization"]
        setManager(null)
    }

    const value = {
        manager,
        login,
        logout,
        loading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
