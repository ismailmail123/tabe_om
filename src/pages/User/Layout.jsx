import React from "react"
import SidebarUser from "../../components/SidebarUser"
import { Outlet } from "react-router-dom"

export default function UserLayout() {
  return (
    <div className="flex">
      <SidebarUser />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}
