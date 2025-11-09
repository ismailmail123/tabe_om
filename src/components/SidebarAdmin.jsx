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

  return (
    <div className="flex">
      <aside
        className={`${
          open ? "w-64" : "w-20"
        } bg-[#0e2238] text-white min-h-screen flex flex-col justify-between transition-all duration-300 shadow-xl`}
      >
        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#14314d]">
            <h2
              className={`text-xl font-semibold transition-all duration-300 ${
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
            Hai, <span className="font-medium text-blue-200">{username}</span>
          </div>

          <nav className="flex flex-col mt-4 space-y-1">
            <NavLink
              to="/dashboard/home"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md mx-2 text-sm transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-[#14314d] text-blue-100 hover:text-white"
                }`
              }
            >
              <LayoutDashboard size={20} />
              {open && <span>Dashboard</span>}
            </NavLink>

            <NavLink
              to="/dashboard/produk"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md mx-2 text-sm transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-[#14314d] text-blue-100 hover:text-white"
                }`
              }
            >
              <Package size={20} />
              {open && <span>Produk</span>}
            </NavLink>

            <NavLink
              to="/dashboard/transaksi"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md mx-2 text-sm relative transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-[#14314d] text-blue-100 hover:text-white"
                }`
              }
              onClick={() => {
                // Reset notif saat admin buka halaman transaksi
                localStorage.setItem("notifTransaksi", false)
                setHasNewTransaction(false)
              }}
            >
              <ShoppingCart size={20} />
              {open && <span>Transaksi</span>}

              {/* 🔔 Notif Indicator */}
              {hasNewTransaction && (
                <span className="absolute right-4 top-2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-[#14314d]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full bg-red-600 hover:bg-red-700 py-2 px-3 rounded-md text-sm font-medium transition"
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </div>
  )
}
