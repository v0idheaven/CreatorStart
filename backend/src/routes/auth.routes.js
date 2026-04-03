import { Router } from "express"
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAvatar
} from "../controllers/auth.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/refresh").post(refreshAccessToken)

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/me").get(verifyJWT, getCurrentUser)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)

export default router