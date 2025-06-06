import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import MenuPage from "./pages/MenuPage"
import ManagerDashboard from "./pages/ManagerDashboard"
import KitchenDashboard from "./pages/KitchenDashboard"
import ManagerLogin from "./pages/ManagerLogin"
import { AuthProvider } from "./context/AuthContext.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/kitchen" element={<KitchenDashboard />} />
            <Route path="/manager/login" element={<ManagerLogin />} />

            {/* Protected Routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<MenuPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
