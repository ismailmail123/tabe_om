
export const login = (username, password) => {
  // Dummy login sederhana
  if (username === "admin" && password === "123") {
    localStorage.setItem("user", JSON.stringify({ role: "admin", username }))
    return true
  } else if (username === "user" && password === "123") {
    localStorage.setItem("user", JSON.stringify({ role: "user", username }))
    return true
  } else {
    return false
  }
}

export const getRole = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  return user?.role || null
}

export const isLoggedIn = () => {
  return !!localStorage.getItem("user")
}

export const logout = () => {
  localStorage.removeItem("user")
}
