export const getRole = () => {
    const user = JSON.parse(localStorage.getItem("authUser"))
        // console.log("Auth User:", user.role)
    return user.user.role || null
}

export const isLoggedIn = () => {
    return !!localStorage.getItem("authUser")
}

export const logout = () => {
    localStorage.removeItem("authUser")
    localStorage.removeItem("auth-storage")
    localStorage.removeItem("token")
}