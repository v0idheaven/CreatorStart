import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Planner } from "../models/planner.model.js"

const getPlannerEntries = asyncHandler(async (req, res) => {
    const entries = await Planner.find({ owner: req.user._id }).sort({ day: 1 })

    return res.status(200).json(
        new ApiResponse(200, entries, "Planner entries fetched")
    )
})

const addPlannerEntry = asyncHandler(async (req, res) => {
    const { day, content, platform } = req.body

    if (!day || !content || !platform) {
        throw new ApiError(400, "day, content and platform are required")
    }

    const existing = await Planner.findOne({ owner: req.user._id, day })
    if (existing) {
        throw new ApiError(400, `Day ${day} already has an entry`)
    }

    const entry = await Planner.create({
        owner: req.user._id,
        day,
        content,
        platform
    })

    return res.status(201).json(
        new ApiResponse(201, entry, "Entry added")
    )
})

const updatePlannerEntry = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { content, platform, isCompleted } = req.body

    const entry = await Planner.findOne({ _id: id, owner: req.user._id })

    if (!entry) {
        throw new ApiError(404, "Entry not found")
    }

    if (content !== undefined) entry.content = content
    if (platform !== undefined) entry.platform = platform
    if (isCompleted !== undefined) entry.isCompleted = isCompleted

    await entry.save()

    return res.status(200).json(
        new ApiResponse(200, entry, "Entry updated")
    )
})

const deletePlannerEntry = asyncHandler(async (req, res) => {
    const { id } = req.params

    const entry = await Planner.findOneAndDelete({ _id: id, owner: req.user._id })

    if (!entry) {
        throw new ApiError(404, "Entry not found")
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Entry deleted")
    )
})

export { getPlannerEntries, addPlannerEntry, updatePlannerEntry, deletePlannerEntry }
