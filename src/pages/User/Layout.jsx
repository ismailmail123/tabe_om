import React from "react"
import SidebarUser from "../../components/SidebarUser"
import { Outlet, useNavigate } from "react-router-dom"
import useTimeRestriction from "../../lib/useTimeRestriction"
import TimeRestrictionModal from "../../components/ui/TimeRestrictionModal"

export default function UserLayout() {
  const isRestricted = useTimeRestriction()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="flex">
      {isRestricted && <TimeRestrictionModal onLogout={handleLogout} />}
      <SidebarUser />
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}