import { Router } from "express"
import {
    getPlannerEntries,
    addPlannerEntry,
    updatePlannerEntry,
    deletePlannerEntry,
    generatePlannerAiPlan,
    generatePlannerAiDetail,
    generateContentIdea
} from "../controllers/planner.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/ai/plan").post(generatePlannerAiPlan)
router.route("/ai/detail").post(generatePlannerAiDetail)
router.route("/ai/content").post(generateContentIdea)

router.use(verifyJWT)

router.route("/").get(getPlannerEntries).post(addPlannerEntry)
router.route("/:id").patch(updatePlannerEntry).delete(deletePlannerEntry)

export default router
