import { Router } from "express"
import {
    registerUser, loginUser, logoutUser, refreshAccessToken,
    getCurrentUser, updateProfile, updatePassword, updateAvatar, deleteAccount
} from "../controllers/auth.controller.js"
import { googleAuthRedirect, googleAuthCallback, refreshYoutubeStats, getYoutubeVideos, getYoutubeAnalytics } from "../controllers/google.controller.js"
import { instagramAuthRedirect, instagramAuthCallback, refreshInstagramStats, linkInstagram } from "../controllers/instagram.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router()

router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser)
router.post("/login", loginUser)
router.post("/refresh", refreshAccessToken)

// Google OAuth
router.get("/google", googleAuthRedirect)
router.get("/google/callback", googleAuthCallback)

// Instagram OAuth
router.get("/instagram", instagramAuthRedirect)
router.get("/instagram/callback", instagramAuthCallback)

router.use(verifyJWT)

router.post("/logout", logoutUser)
router.get("/me", getCurrentUser)
router.patch("/profile", updateProfile)
router.patch("/password", updatePassword)
router.patch("/avatar", upload.single("avatar"), updateAvatar)
router.delete("/account", deleteAccount)
router.post("/youtube/refresh", refreshYoutubeStats)
router.get("/youtube/videos", getYoutubeVideos)
router.get("/youtube/analytics", getYoutubeAnalytics)
router.post("/instagram/refresh", refreshInstagramStats)
router.post("/instagram/link", linkInstagram)

export default router
