import React, { useState, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../utils/auth"
import { Menu, X, LogOut, ShoppingBag, Clock, ShoppingCart, User, Home } from "lucide-react"

export default function SidebarUser() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const username = user?.username || "Pengguna"

  const [open, setOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [cartItemsCount, setCartItemsCount] = useState(0)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile && !open) setOpen(true)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [open])

  // Get cart items count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
      setCartItemsCount(totalItems)
    }

    updateCartCount()
    
    const handleStorageChange = () => {
      updateCartCount()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cartUpdated", updateCartCount)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Menu items configuration
  const menuItems = [
    {
      path: "/user/belanja",
      icon: ShoppingBag,
      label: "Belanja",
    },
    {
      path: "/user/keranjang",
      icon: ShoppingCart,
      label: "Keranjang",
      badge: cartItemsCount > 0 ? cartItemsCount : null,
    },
    {
      path: "/user/history",
      icon: Clock,
      label: "Riwayat",
    },
  ]

  return (
    <>
      {/* Desktop Sidebar - Simplified */}
      <aside
        className={`hidden md:flex ${
          open ? "w-64" : "w-20"
        } bg-gradient-to-b from-[#0e2238] to-[#0a1a2c] text-white min-h-screen flex-col justify-between transition-all duration-300 shadow-xl sticky top-0`}
      >
        {/* Header Only */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#14314d]">
            <h2
              className={`text-xl font-bold transition-all duration-300 ${
                !open && "opacity-0 hidden"
              }`}
            >
              Koperasi
            </h2>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md hover:bg-[#14314d] transition"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Navigation Menu Only - No User Info */}
          <nav className="flex flex-col mt-6 space-y-1 p-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md text-sm transition relative group ${
                    isActive
                      ? "bg-green-600 shadow-md"
                      : "hover:bg-[#14314d] text-blue-100 hover:text-white"
                  }`
                }
              >
                <item.icon size={20} />
                {open && <span>{item.label}</span>}
                
                {/* Cart Badge */}
                {item.badge && (
                  <span className="absolute right-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
                
                {/* Tooltip when sidebar is collapsed */}
                {!open && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
                    {item.label}
                    {item.badge && ` (${item.badge})`}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer (Logout) */}
        <div className="p-4 border-t border-[#14314d]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-2 px-3 rounded-md text-sm font-medium transition shadow-md"
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Only - No Top Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-2 md:hidden shadow-lg z-50">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg text-xs transition relative flex-1 mx-1 ${
                isActive
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:text-green-500"
              }`
            }
          >
            <div className="relative">
              <item.icon size={22} />
              {/* Cart Badge for Mobile */}
              {item.badge && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
        
        {/* Logout Button for Mobile */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-2 rounded-lg text-xs text-gray-600 hover:text-red-500 transition flex-1 mx-1"
        >
          <LogOut size={22} />
          <span className="mt-1">Logout</span>
        </button>
      </div>
    </>
  )
}