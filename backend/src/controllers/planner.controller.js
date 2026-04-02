import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Planner } from "../models/planner.model.js"
import fetch from "node-fetch"

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

const callGroq = async (prompt, temperature = 0.8) => {
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
        throw new ApiError(500, "GROQ_API_KEY is not configured on server")
    }

    const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new ApiError(response.status, data?.error?.message || "Groq API error")
    }

    return data?.choices?.[0]?.message?.content || ""
}

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

const generatePlannerAiPlan = asyncHandler(async (req, res) => {
    const { goalLabel, topicLabel, freqLabel, platformLabel, daysLeft } = req.body

    if (!goalLabel || !topicLabel || !freqLabel || !platformLabel || !daysLeft) {
        throw new ApiError(400, "goalLabel, topicLabel, freqLabel, platformLabel and daysLeft are required")
    }

    const prompt = `You are a content strategist. Create a ${daysLeft}-day content plan for a ${platformLabel} creator.

Goal: ${goalLabel}
Topic/Niche: ${topicLabel}
Posting frequency: ${freqLabel}

Return ONLY a JSON array with exactly ${daysLeft} objects. Each object must have:
- "day": number (1 to ${daysLeft})
- "content": string (specific content idea for that day, 1 sentence)

For "${freqLabel}" frequency:
- "Every day": all days have content
- "Every 2 days": odd days (1,3,5...) have content, even days have empty string ""
- "Weekdays only": Mon-Fri have content, Sat-Sun have empty string ""

Make content ideas specific, actionable, and varied. No generic titles.
Return only the JSON array, no explanation.`

    const text = await callGroq(prompt, 0.8)
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const match = cleaned.match(/\[[\s\S]*\]/)

    if (!match) {
        throw new ApiError(422, "Could not parse plan from AI response")
    }

    return res.status(200).json(
        new ApiResponse(200, JSON.parse(match[0]), "AI plan generated")
    )
})

const generatePlannerAiDetail = asyncHandler(async (req, res) => {
    const { content, platformLabel } = req.body

    if (!content || !platformLabel) {
        throw new ApiError(400, "content and platformLabel are required")
    }

    const prompt = `You are a content strategist. Generate a detailed content brief for a ${platformLabel} creator.

Topic: "${content}"
Platform: ${platformLabel}

Return ONLY a raw JSON object (no markdown, no code blocks, no explanation) with these exact keys:
- hook: A compelling opening line (1-2 sentences)
- whatToSay: 3-4 key talking points as a string
- script: Short script outline with sections
- cta: A strong call to action
- tip: One pro tip for this content

Example format: {"hook":"...","whatToSay":"...","script":"...","cta":"...","tip":"..."}`

    const text = await callGroq(prompt, 0.7)
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    let parsed = null

    try {
        parsed = JSON.parse(cleaned)
    } catch {
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (match) {
            parsed = JSON.parse(match[0])
        }
    }

    if (!parsed) {
        throw new ApiError(422, "Could not parse detail from AI response")
    }

    return res.status(200).json(
        new ApiResponse(200, parsed, "AI detail generated")
    )
})

const generateContentIdea = asyncHandler(async (req, res) => {
    const { platform, format, niche, goal, tone, topic } = req.body

    if (!platform || !format || !niche || !goal || !tone) {
        throw new ApiError(400, "platform, format, niche, goal and tone are required")
    }

    const topicLine = topic ? `Topic/Keyword: ${topic}` : "Topic/Keyword: (none provided)"

    const schemaByPlatform = {
        youtube: `{
  "title": "string",
  "hook": "string",
  "outline": "string",
  "description": "string",
  "tags": "string"
}`,
        instagram: `{
  "hook": "string",
  "caption": "string",
  "hashtags": "string",
  "cta": "string",
  "reelIdea": "string"
}`,
        both: `{
  "hook": "string",
  "angle": "string",
  "outline": "string",
  "caption": "string",
  "tip": "string"
}`
    }

    const outputSchema = schemaByPlatform[platform] || schemaByPlatform.both

    const prompt = `You are an expert content strategist.

Create a high-quality content idea package with these inputs:
- Platform: ${platform}
- Format: ${format}
- Niche: ${niche}
- Goal: ${goal}
- Tone: ${tone}
- ${topicLine}

Return ONLY a valid raw JSON object (no markdown, no code blocks, no explanation) using exactly this schema:
${outputSchema}

Rules:
- Keep output practical, specific, and creator-ready.
- Avoid generic fluff.
- Keep fields concise but useful.`

    const text = await callGroq(prompt, 0.8)
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

    let parsed = null
    try {
        parsed = JSON.parse(cleaned)
    } catch {
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (match) {
            parsed = JSON.parse(match[0])
        }
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new ApiError(422, "Could not parse content idea from AI response")
    }

    return res.status(200).json(
        new ApiResponse(200, parsed, "AI content generated")
    )
})

export {
    getPlannerEntries,
    addPlannerEntry,
    updatePlannerEntry,
    deletePlannerEntry,
    generatePlannerAiPlan,
    generatePlannerAiDetail,
    generateContentIdea
}
