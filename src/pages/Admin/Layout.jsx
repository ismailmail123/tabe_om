// src/pages/Admin/Layout.jsx
import React from "react"
import { Outlet } from "react-router-dom"
import SidebarAdmin from "../../components/SidebarAdmin"

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-['Poppins']">
      {/* Sidebar dari komponen terpisah */}
      <SidebarAdmin />

      {/* Konten utama */}
      <main className="flex-1 p-6 md:p-8">
        <Outlet /> {/* tempat render isi halaman admin */}
      </main>
    </div>
  )
}
