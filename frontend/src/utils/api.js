import { API_ENDPOINTS } from "../constants/api"

// wraps fetch with auth header + auto token refresh on 401
export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("accessToken")
    const headers = {
        ...(options.headers || {}),
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
    // don't set Content-Type for FormData
    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json"
    }

    let res = await fetch(url, { ...options, headers, credentials: "include" })

    // try refresh on 401
    if (res.status === 401) {
        const refreshed = await tryRefresh()
        if (refreshed) {
            const newToken = localStorage.getItem("accessToken")
            headers["Authorization"] = `Bearer ${newToken}`
            res = await fetch(url, { ...options, headers, credentials: "include" })
        }
    }

    return res
}

async function tryRefresh() {
    try {
        const res = await fetch(API_ENDPOINTS.refresh, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })
        if (!res.ok) return false
        const data = await res.json()
        if (data?.data?.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken)
            return true
        }
        return false
    } catch {
        return false
    }
}
