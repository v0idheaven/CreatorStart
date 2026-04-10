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
    const { platform, format, niche, goal, tone, topic, outputType } = req.body
    if (!platform || !format || !niche || !goal || !tone) throw new ApiError(400, "platform, format, niche, goal and tone are required")

    const outputInstructions = {
        full_script: `Write a complete, detailed, word-for-word script the creator can read directly. Include intro, main body with all talking points fully written out, and outro. Make it natural and conversational.`,
        bullet_points: `Provide 6-8 detailed bullet points covering the main talking points. Each bullet should be 1-2 sentences with enough detail to speak from.`,
        hook_only: `Write 3 different strong opening hooks (first 15 seconds) and 3 different call-to-action options. Make them punchy and platform-optimized.`,
        outline: `Create a detailed structured outline with sections, sub-points, timing suggestions, and transition notes.`,
        caption: `Write a complete ready-to-post caption with emojis, line breaks for readability, and a full set of relevant hashtags (20-30).`,
    }

    const schemas = {
        youtube: {
            full_script: `{"title":"catchy video title","hook":"opening hook line","script":"full word-for-word script","description":"YouTube description with timestamps","tags":"comma separated tags"}`,
            bullet_points: `{"title":"catchy video title","hook":"opening hook","points":"all talking points in detail","description":"YouTube description","tags":"comma separated tags"}`,
            hook_only: `{"title":"catchy video title","hook":"3 hook options numbered","cta":"3 CTA options numbered","tip":"pro tip for this format"}`,
            outline: `{"title":"catchy video title","hook":"opening hook","outline":"full structured outline with sections and timing","description":"YouTube description","tags":"comma separated tags"}`,
            caption: `{"title":"catchy video title","hook":"opening hook","script":"full script","description":"YouTube description with timestamps","tags":"comma separated tags"}`,
        },
        instagram: {
            full_script: `{"hook":"opening hook","script":"full word-for-word reel script","caption":"full caption with emojis","hashtags":"30 relevant hashtags","cta":"call to action"}`,
            bullet_points: `{"hook":"opening hook","points":"6-8 detailed talking points","caption":"full caption with emojis","hashtags":"30 relevant hashtags","cta":"call to action"}`,
            hook_only: `{"hook":"3 hook options numbered","cta":"3 CTA options numbered","caption":"short caption","hashtags":"20 relevant hashtags"}`,
            outline: `{"hook":"opening hook","outline":"structured reel outline with timing","caption":"full caption with emojis","hashtags":"30 relevant hashtags","cta":"call to action"}`,
            caption: `{"hook":"opening hook","caption":"full detailed caption with emojis and line breaks","hashtags":"30 relevant hashtags","cta":"call to action","reelIdea":"visual concept description"}`,
        },
        both: {
            full_script: `{"hook":"opening hook","script":"full word-for-word script","caption":"Instagram caption with emojis","outline":"YouTube outline","hashtags":"relevant hashtags","tip":"platform-specific tip"}`,
            bullet_points: `{"hook":"opening hook","points":"6-8 detailed talking points","caption":"Instagram caption","hashtags":"relevant hashtags","tip":"pro tip"}`,
            hook_only: `{"hook":"3 hook options numbered","cta":"3 CTA options numbered","caption":"short caption","tip":"pro tip"}`,
            outline: `{"hook":"opening hook","outline":"detailed structured outline","caption":"Instagram caption","hashtags":"relevant hashtags","tip":"pro tip"}`,
            caption: `{"hook":"opening hook","caption":"full caption with emojis","hashtags":"30 relevant hashtags","cta":"call to action","tip":"pro tip"}`,
        }
    }

    const outputKey = outputType || "full_script"
    const schema = schemas[platform]?.[outputKey] || schemas.both.full_script
    const instruction = outputInstructions[outputKey] || outputInstructions.full_script

    const prompt = `You are an expert content strategist and scriptwriter for social media creators.

Creator details:
- Platform: ${platform}
- Format: ${format}
- Niche: ${niche}
- Goal: ${goal}
- Tone: ${tone}
- Topic: ${topic || "(creator's choice — pick something trending in this niche)"}

Task: ${instruction}

Important:
- Be specific, detailed and practical — not generic
- Write as if you are the creator speaking to their audience
- Match the ${tone} tone throughout
- Optimize for ${platform} best practices
- Make it immediately usable — no placeholders

Return ONLY a valid raw JSON object using this exact schema:
${schema}`

    const text = await callGroq(prompt, 0.75)
    const parsed = parseJson(text)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new ApiError(422, "Could not parse AI response")

    return res.status(200).json(new ApiResponse(200, parsed, "Content generated"))
})

export { savePlanData, getPlanData, saveStreakData, getStreakData, generatePlannerAiDetail, generateContentIdea }
