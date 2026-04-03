import { Router } from "express"
import {
    savePlanData, getPlanData, saveStreakData, getStreakData,
    generatePlannerAiDetail, generateContentIdea
} from "../controllers/planner.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

// public AI routes (no auth needed)
router.post("/ai/detail", generatePlannerAiDetail)
router.post("/ai/content", generateContentIdea)

// protected routes
router.use(verifyJWT)

router.post("/plan", savePlanData)
router.get("/plan/:platform", getPlanData)
router.post("/streak", saveStreakData)
router.get("/streak/:platform", getStreakData)

export default router
