import { Router } from "express"
import {
    registerUser, loginUser, logoutUser, refreshAccessToken,
    getCurrentUser, updateProfile, updatePassword, updateAvatar, deleteAccount, saveCreatorProfile
} from "../controllers/auth.controller.js"
import { googleAuthRedirect, googleAuthCallback, refreshYoutubeStats, getYoutubeVideos, getYoutubeAnalytics } from "../controllers/google.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router()

router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser)
router.post("/login", loginUser)
router.post("/refresh", refreshAccessToken)

// Google OAuth
router.get("/google", googleAuthRedirect)
router.get("/google/callback", googleAuthCallback)

router.use(verifyJWT)

router.post("/logout", logoutUser)
router.get("/me", getCurrentUser)
router.patch("/profile", updateProfile)
router.patch("/creator-profile", saveCreatorProfile)
router.patch("/password", updatePassword)
router.patch("/avatar", upload.single("avatar"), updateAvatar)
router.delete("/account", deleteAccount)
router.post("/youtube/refresh", refreshYoutubeStats)
router.get("/youtube/videos", getYoutubeVideos)
router.get("/youtube/analytics", getYoutubeAnalytics)

export default router
