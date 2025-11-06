import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { isLoggedIn, getRole, logout } from "../../utils/auth"

export default function Admin() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn() || getRole() !== "admin") {
      navigate("/login")
    }
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard Admin</h1>
      <p>Halo, {localStorage.getItem("username")}!</p>
      <button
        onClick={() => {
          logout()
          navigate("/login")
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}
