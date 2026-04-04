import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Planner } from "../models/planner.model.js"
import fetch from "node-fetch"

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL = "llama-3.3-70b-versatile"

const callGroq = async (prompt, temperature = 0.8) => {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new ApiError(500, "GROQ_API_KEY not configured")

    const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: "user", content: prompt }], temperature })
    })
    const data = await res.json()
    if (!res.ok) throw new ApiError(res.status, data?.error?.message || "Groq API error")
    return data?.choices?.[0]?.message?.content || ""
}

const parseJson = (text) => {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    try { return JSON.parse(cleaned) } catch {
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (match) return JSON.parse(match[0])
        return null
    }
}

const savePlanData = asyncHandler(async (req, res) => {
    const { platform, planData } = req.body
    if (!platform) throw new ApiError(400, "platform is required")

    const doc = await Planner.findOneAndUpdate(
        { owner: req.user._id, platform },
        { $set: { planData: planData || null } },
        { upsert: true, new: true }
    )
    return res.status(200).json(new ApiResponse(200, doc, "Plan saved"))
})

const getPlanData = asyncHandler(async (req, res) => {
    const { platform } = req.params
    if (!platform) throw new ApiError(400, "platform is required")

    const doc = await Planner.findOne({ owner: req.user._id, platform })
    return res.status(200).json(new ApiResponse(200, doc?.planData || null, "Plan fetched"))
})

const saveStreakData = asyncHandler(async (req, res) => {
    const { platform, streakData } = req.body
    if (!platform || !Array.isArray(streakData)) throw new ApiError(400, "platform and streakData array are required")

    const doc = await Planner.findOneAndUpdate(
        { owner: req.user._id, platform },
        { $set: { streakData } },
        { upsert: true, new: true }
    )
    return res.status(200).json(new ApiResponse(200, doc, "Streak saved"))
})

const getStreakData = asyncHandler(async (req, res) => {
    const { platform } = req.params
    const doc = await Planner.findOne({ owner: req.user._id, platform })
    return res.status(200).json(new ApiResponse(200, doc?.streakData || [], "Streak fetched"))
})

const generatePlannerAiDetail = asyncHandler(async (req, res) => {
    const { content, platformLabel } = req.body
    if (!content || !platformLabel) throw new ApiError(400, "content and platformLabel are required")

    const prompt = `You are a content strategist. Generate a detailed content brief for a ${platformLabel} creator.

Topic: "${content}"
Platform: ${platformLabel}

Return ONLY a raw JSON object (no markdown, no code blocks) with these exact keys:
- hook: A compelling opening line (1-2 sentences)
- whatToSay: 3-4 key talking points as a string
- script: Short script outline with sections
- cta: A strong call to action
- tip: One pro tip for this content

Example: {"hook":"...","whatToSay":"...","script":"...","cta":"...","tip":"..."}`

    const text = await callGroq(prompt, 0.7)
    const parsed = parseJson(text)
    if (!parsed) throw new ApiError(422, "Could not parse AI response")

    return res.status(200).json(new ApiResponse(200, parsed, "AI detail generated"))
})

const generateContentIdea = asyncHandler(async (req, res) => {
    const { platform, format, niche, goal, tone, topic } = req.body
    if (!platform || !format || !niche || !goal || !tone) throw new ApiError(400, "platform, format, niche, goal and tone are required")

    const schemas = {
        youtube: `{"title":"string","hook":"string","outline":"string","description":"string","tags":"string"}`,
        instagram: `{"hook":"string","caption":"string","hashtags":"string","cta":"string","reelIdea":"string"}`,
        both: `{"hook":"string","angle":"string","outline":"string","caption":"string","tip":"string"}`
    }

    const prompt = `You are an expert content strategist.

Create a high-quality content idea with:
- Platform: ${platform}
- Format: ${format}
- Niche: ${niche}
- Goal: ${goal}
- Tone: ${tone}
- Topic: ${topic || "(none)"}

Return ONLY a valid raw JSON object using this schema: ${schemas[platform] || schemas.both}
Keep it practical, specific, and creator-ready.`

    const text = await callGroq(prompt, 0.8)
    const parsed = parseJson(text)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new ApiError(422, "Could not parse AI response")

    return res.status(200).json(new ApiResponse(200, parsed, "Content idea generated"))
})

export { savePlanData, getPlanData, saveStreakData, getStreakData, generatePlannerAiDetail, generateContentIdea }
