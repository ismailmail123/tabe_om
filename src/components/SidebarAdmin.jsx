import React, { useState, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../utils/auth"
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Bell,
} from "lucide-react"

export default function SidebarAdmin() {
  const navigate = useNavigate()
  const admin = JSON.parse(localStorage.getItem("user"))
  const username = admin?.username || "Admin"

  const [open, setOpen] = useState(true)
  const [hasNewTransaction, setHasNewTransaction] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

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

  // Cek apakah ada transaksi baru
  useEffect(() => {
    const checkTransaction = () => {
      const notif = JSON.parse(localStorage.getItem("notifTransaksi")) || false
      setHasNewTransaction(notif)
    }

    checkTransaction()
    window.addEventListener("storage", checkTransaction)
    return () => window.removeEventListener("storage", checkTransaction)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const resetNotification = () => {
    localStorage.setItem("notifTransaksi", false)
    setHasNewTransaction(false)
  }

  // Menu items configuration
  const menuItems = [
    {
      path: "/dashboard/home",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: "/dashboard/produk",
      icon: Package,
      label: "Produk",
    },
    {
      path: "/dashboard/transaksi",
      icon: ShoppingCart,
      label: "Transaksi",
      hasNotification: hasNewTransaction,
      onClick: resetNotification,
    },
  ]

  // Jika di mobile, hanya render bottom navigation saja
  if (isMobile) {
    return (
      <>
        {/* Mobile Bottom Navigation ONLY - No Top Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-2 shadow-lg z-50 md:hidden">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg text-xs transition relative flex-1 mx-1 ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-500"
                }`
              }
              onClick={item.onClick}
            >
              <div className="relative">
                <item.icon size={22} />
                {/* Notification Badge for Mobile */}
                {item.hasNotification && (
                  <span className="absolute -top-1 -right-1">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </span>
                )}
              </div>
              <span className="mt-1 text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {/* Logout Button for Mobile */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 rounded-lg text-xs text-gray-600 hover:text-red-500 transition flex-1 mx-1"
          >
            <LogOut size={22} />
            <span className="mt-1 text-[10px] font-medium">Logout</span>
          </button>
        </div>

        {/* Spacer untuk konten utama agar tidak tertutup bottom navigation */}
        <div className="h-16 md:h-0"></div>
      </>
    )
  }

  // Desktop Sidebar (tetap lengkap)
  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-gradient-to-b from-[#0e2238] to-[#0a1a2c] text-white min-h-screen flex flex-col justify-between transition-all duration-300 shadow-xl sticky top-0`}
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b border-[#14314d]">
          <h2
            className={`text-xl font-bold transition-all duration-300 ${
              !open && "opacity-0 hidden"
            }`}
          >
            Admin Panel
          </h2>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-[#14314d] transition"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div
          className={`p-4 border-b border-[#14314d] text-sm transition-all duration-300 ${
            !open && "opacity-0 hidden"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-blue-100">Hai,</p>
              <p className="font-medium text-white">{username}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col mt-4 space-y-1 p-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md text-sm transition relative group ${
                  isActive
                    ? "bg-blue-600 shadow-md"
                    : "hover:bg-[#14314d] text-blue-100 hover:text-white"
                }`
              }
              onClick={item.onClick}
            >
              <item.icon size={20} />
              {open && <span>{item.label}</span>}
              
              {/* Notification Badge */}
              {item.hasNotification && (
                <span className="absolute right-4">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </span>
              )}
              
              {/* Tooltip when sidebar is collapsed */}
              {!open && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
                  {item.label}
                  {item.hasNotification && " • New"}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

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
  )
}