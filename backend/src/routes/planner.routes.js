import { Router } from "express"
import {
    savePlanData, getPlanData, saveStreakData, getStreakData,
    generatePlannerAiDetail, generateContentIdea, scoreContent, generateHooks, generateToneVariants
} from "../controllers/planner.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

// public AI routes (no auth needed)
router.post("/ai/detail", generatePlannerAiDetail)
router.post("/ai/content", generateContentIdea)
router.post("/ai/score", scoreContent)
router.post("/ai/hooks", generateHooks)
router.post("/ai/tones", generateToneVariants)

// protected routes
router.use(verifyJWT)

router.post("/plan", savePlanData)
router.get("/plan/:platform", getPlanData)
router.post("/streak", saveStreakData)
router.get("/streak/:platform", getStreakData)

export default router
