import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../utils/auth"
import { Menu, X, LogOut, ShoppingBag, Clock, ShoppingCart } from "lucide-react" // 🛒 tambahkan ShoppingCart

export default function SidebarUser() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const username = user?.username || "Pengguna"

  const [open, setOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`${
          open ? "w-64" : "w-20"
        } bg-[#0e2238] text-white min-h-screen flex flex-col justify-between transition-all duration-300 shadow-xl`}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#14314d]">
            <h2
              className={`text-xl font-semibold transition-all duration-300 ${
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

          {/* User info */}
          <div
            className={`p-4 border-b border-[#14314d] text-sm transition-all duration-300 ${
              !open && "opacity-0 hidden"
            }`}
          >
            Hai, <span className="font-medium text-blue-200">{username}</span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col mt-4 space-y-1">
            <NavLink
              to="/user/belanja"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md mx-2 text-sm transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-[#14314d] text-blue-100 hover:text-white"
                }`
              }
            >
              <ShoppingBag size={20} />
              {open && <span>Belanja</span>}
            </NavLink>

            {/* 🛒 Keranjang */}
            <NavLink
              to="/user/keranjang"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md mx-2 text-sm transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-[#14314d] text-blue-100 hover:text-white"
                }`
              }
            >
              <ShoppingCart size={20} />
              {open && <span>Keranjang</span>}
            </NavLink>

            <NavLink
              to="/user/history"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md mx-2 text-sm transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-[#14314d] text-blue-100 hover:text-white"
                }`
              }
            >
              <Clock size={20} />
              {open && <span>Riwayat</span>}
            </NavLink>
          </nav>
        </div>

        {/* Footer (Logout) */}
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
