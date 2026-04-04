const BASE = import.meta.env.VITE_API_URL || "https://creator-start-backend.onrender.com"

export const API_ENDPOINTS = {
    // Google OAuth
    googleAuth: `${BASE}/api/v1/auth/google`,
    youtubeRefresh: `${BASE}/api/v1/auth/youtube/refresh`,
    youtubeVideos: `${BASE}/api/v1/auth/youtube/videos`,
    youtubeAnalytics: `${BASE}/api/v1/auth/youtube/analytics`,
    // Instagram OAuth
    instagramAuth: `${BASE}/api/v1/auth/instagram`,
    instagramRefresh: `${BASE}/api/v1/auth/instagram/refresh`,
    instagramLink: `${BASE}/api/v1/auth/instagram/link`,
    instagramCheck: (username) => `${BASE}/api/v1/auth/instagram/check/${username}`,
    instagramMedia: `${BASE}/api/v1/auth/instagram/media`,
    instagramInsights: `${BASE}/api/v1/auth/instagram/insights`,
    // auth
    register: `${BASE}/api/v1/auth/register`,
    login: `${BASE}/api/v1/auth/login`,
    logout: `${BASE}/api/v1/auth/logout`,
    refresh: `${BASE}/api/v1/auth/refresh`,
    me: `${BASE}/api/v1/auth/me`,
    updateProfile: `${BASE}/api/v1/auth/profile`,
    updatePassword: `${BASE}/api/v1/auth/password`,
    updateAvatar: `${BASE}/api/v1/auth/avatar`,
    deleteAccount: `${BASE}/api/v1/auth/account`,

    // planner
    savePlan: `${BASE}/api/v1/planner/plan`,
    getPlan: (platform) => `${BASE}/api/v1/planner/plan/${platform}`,
    saveStreak: `${BASE}/api/v1/planner/streak`,
    getStreak: (platform) => `${BASE}/api/v1/planner/streak/${platform}`,

    // AI
    plannerAiDetail: `${BASE}/api/v1/planner/ai/detail`,
    contentGenerator: `${BASE}/api/v1/planner/ai/content`,
}

// helper — attaches auth header automatically
export function authHeaders() {
    const token = localStorage.getItem("accessToken")
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
}

// helper for multipart (no Content-Type, browser sets boundary)
export function authHeadersMultipart() {
    const token = localStorage.getItem("accessToken")
    return token ? { "Authorization": `Bearer ${token}` } : {}
}
