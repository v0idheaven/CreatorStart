import { GOALS, TOPICS, FREQUENCIES, CONTENT_TYPES } from "../../constants/plannerConstants"

// Topic-specific viral content ideas (2025-2026 trending)
const TOPIC_IDEAS = {
  tech: [
    "I tested 5 AI tools so you don't have to — here's what actually works",
    "ChatGPT vs Gemini vs Claude: honest comparison for creators",
    "How I use AI to create a week of content in 1 hour",
    "The AI tool that replaced my entire editing workflow",
    "5 free AI tools that feel like they should cost money",
    "Why everyone is switching from X to this new AI model",
    "I built a full app using only AI — here's what happened",
    "The dark side of AI content creation nobody talks about",
    "How to use AI without losing your authentic voice",
    "Top 10 AI prompts every creator needs to save right now",
    "This AI tool just changed how I research content",
    "How I 10x my productivity using these AI workflows",
    "AI is not replacing creators — it's replacing lazy creators",
    "The only AI tools worth paying for in 2025",
    "How to make money with AI as a content creator",
  ],
  finance: [
    "I saved ₹1 lakh in 6 months using this simple method",
    "Why your savings account is actually losing you money",
    "How to start investing with just ₹500 per month",
    "The money mistake 90% of people in their 20s make",
    "Index funds vs mutual funds: which one should you pick?",
    "How I built a passive income stream from scratch",
    "The truth about credit cards nobody tells you",
    "How to negotiate a salary raise (scripts that work)",
    "Emergency fund: how much do you actually need?",
    "5 money habits that changed my financial life",
    "Why I stopped buying things I don't need (and saved lakhs)",
    "How to read a balance sheet in 10 minutes",
    "The compound interest trick that will blow your mind",
    "How to build wealth on a ₹30,000 salary",
    "Crypto in 2025: what you need to know before investing",
  ],
  fitness: [
    "I worked out for 30 days straight — here's what changed",
    "The 10-minute morning routine that transformed my energy",
    "Why you're not losing weight despite working out",
    "Home workout vs gym: the honest truth after 1 year",
    "5 exercises that burn more fat than running",
    "What I eat in a day to stay lean and energized",
    "The protein myth: how much do you actually need?",
    "How to build muscle without expensive supplements",
    "I tried intermittent fasting for 60 days — real results",
    "The sleep hack that improved my workout performance by 40%",
    "Why most people quit fitness in 3 weeks (and how to not)",
    "Beginner's guide to the gym: no more feeling lost",
    "How to stay fit when you have zero time",
    "The best free fitness apps that actually work",
    "My honest review of creatine after 6 months",
  ],
  food: [
    "5 high-protein meals I make every week under ₹200",
    "I ate only home-cooked food for 30 days — what happened",
    "The easiest meal prep routine for busy people",
    "Restaurant-style butter chicken made at home in 20 mins",
    "Why I stopped eating ultra-processed food (and what I eat now)",
    "5 healthy breakfast ideas that take under 5 minutes",
    "The best budget meals for college students",
    "How to make your food taste better without extra calories",
    "I tried every viral food trend — here's what's actually good",
    "The one ingredient that makes everything taste better",
    "How to cook for the whole week in 2 hours",
    "Healthy Indian food that actually tastes amazing",
    "5 snacks that are actually good for you",
    "The truth about 'healthy' packaged foods",
    "How I lost weight without giving up my favourite foods",
  ],
  travel: [
    "Hidden gems in India that tourists don't know about",
    "How I travelled for 2 weeks on a ₹15,000 budget",
    "The best solo travel destinations in India for beginners",
    "Travel hacks that saved me thousands on flights",
    "What nobody tells you about travelling to Bali",
    "How to travel more when you have a 9-5 job",
    "The cheapest way to travel internationally from India",
    "My honest review of budget hostels vs hotels",
    "5 things I wish I knew before my first solo trip",
    "How to pack for 2 weeks in a carry-on only",
    "The best travel credit cards for Indians in 2025",
    "How I work remotely while travelling full-time",
    "Visa-free countries for Indian passport holders",
    "The most underrated hill stations in India",
    "How to travel safely as a solo female traveller",
  ],
  business: [
    "How I started a business with ₹0 investment",
    "The business model that made me financially free at 25",
    "Why 90% of startups fail in the first year",
    "How to validate your business idea before spending money",
    "The freelancing skills that pay the most in 2025",
    "How I got my first 10 clients with no experience",
    "The truth about passive income (it's not what you think)",
    "How to build a personal brand that attracts opportunities",
    "5 side hustles that actually make real money",
    "How to price your services without underselling yourself",
    "The LinkedIn strategy that got me 50 leads in a month",
    "How to scale from ₹1L to ₹10L per month",
    "The one skill that will make you rich in the next 5 years",
    "How to fire your boss and work for yourself",
    "Building a business while working a full-time job",
  ],
  education: [
    "How I learned a new skill in 30 days using this method",
    "The study technique that helped me score 95% without stress",
    "Why traditional education is failing us (and what to do)",
    "5 free courses that are better than a college degree",
    "How to learn anything 10x faster using science",
    "The note-taking system that changed how I study",
    "How to build a portfolio with zero experience",
    "The skills that will be most valuable in 2030",
    "How I got a job at a top company without a degree",
    "The truth about online certifications — are they worth it?",
    "How to learn coding from scratch in 6 months",
    "The reading habit that made me smarter and more productive",
    "How to network when you're an introvert",
    "5 YouTube channels that are better than any course",
    "How to get a scholarship for studying abroad",
  ],
  entertainment: [
    "I watched every trending show so you don't have to",
    "The most underrated movies of 2025 you need to watch",
    "Why this show broke the internet (honest review)",
    "Ranking every Marvel movie from worst to best",
    "The anime that changed how I see storytelling",
    "Why Indian content is finally going global",
    "The most binge-worthy shows on Netflix right now",
    "Hot take: this popular show is actually overrated",
    "The movie that predicted everything happening today",
    "Why I deleted social media for 30 days (and what happened)",
    "The best podcasts for people who hate podcasts",
    "How streaming killed the movie theatre experience",
    "The most iconic scenes in cinema history",
    "Why nostalgia content is dominating social media",
    "The creator economy is changing entertainment forever",
  ],
  gaming: [
    "I played the most hyped game of 2025 — honest review",
    "How to improve at FPS games in 7 days",
    "The best budget gaming setup under ₹30,000",
    "Why mobile gaming is actually getting good",
    "How I went from noob to pro in BGMI",
    "The gaming chair vs regular chair debate — settled",
    "5 games that are better than any AAA title this year",
    "How to start a gaming channel with zero subscribers",
    "The truth about gaming addiction (from a gamer)",
    "Best free games that feel like paid games",
    "How to make money playing games in India",
    "The most anticipated games releasing this year",
    "Why I switched from console to PC gaming",
    "How to reduce lag and improve FPS on any PC",
    "The gaming community is toxic — here's how to deal with it",
  ],
  fashion: [
    "I wore only 10 outfits for 30 days — what I learned",
    "How to build a capsule wardrobe on a budget",
    "The skincare routine that cleared my skin in 2 weeks",
    "Why fast fashion is destroying your style (and wallet)",
    "5 fashion trends that are actually worth trying in 2025",
    "How to dress well when you have no idea about fashion",
    "The best affordable skincare products that actually work",
    "How I transformed my style without spending much",
    "The makeup products I use every single day",
    "Why I switched to sustainable fashion (and how you can too)",
    "How to find your personal style in 5 steps",
    "The hair care routine that stopped my hair fall",
    "Best budget alternatives to luxury fashion brands",
    "How to shop smart during sales without overspending",
    "The glow-up routine that changed my confidence",
  ],
}

export function buildFallbackContent(goalLabel, topicLabel, platformLabel, dayNum, seed) {
  // Find topic key from label
  const topicKey = Object.keys(TOPIC_IDEAS).find(k =>
    topicLabel.toLowerCase().includes(k) ||
    k.includes(topicLabel.toLowerCase().split(" ")[0])
  )

  if (topicKey && TOPIC_IDEAS[topicKey]) {
    const ideas = TOPIC_IDEAS[topicKey]
    const idx = (dayNum * 3 + seed * 7) % ideas.length
    return ideas[idx]
  }

  // Generic fallback
  const generic = [
    `How to ${goalLabel.toLowerCase()} with ${topicLabel} content`,
    `${topicLabel}: what's working right now on ${platformLabel}`,
    `My honest take on ${topicLabel} in 2025`,
    `5 ${topicLabel} ideas that will blow up on ${platformLabel}`,
    `The ${topicLabel} strategy nobody is talking about`,
    `Why your ${topicLabel} content isn't growing (and the fix)`,
    `${topicLabel} for beginners: start here`,
    `How I use ${topicLabel} to ${goalLabel.toLowerCase()}`,
  ]
  const idx = (dayNum * 3 + seed * 7) % generic.length
  return generic[idx]
}

function pickContentType(platform, dayNum, seed) {
  const types = CONTENT_TYPES[platform] || CONTENT_TYPES.both
  return types[(dayNum + seed) % types.length].id
}

export function generatePlan(goal, topic, freq, focus, platform, seed = 0) {
  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  const today = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const focusPlatform = focus || platform
  const goalLabel = GOALS.find(g => g.id === goal)?.label || goal
  const topicLabel = TOPICS.find(t => t.id === topic)?.label || topic

  return Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(firstDay)
    date.setDate(firstDay.getDate() + i)
    const dayNum = i + 1
    const isPast = date < today
    const isToday = date.getTime() === today.getTime()
    const offsetFromToday = Math.round((date - today) / 86400000)

    let isActive = false
    if (!isPast) {
      if (freq === "daily") isActive = true
      else if (freq === "alt") isActive = offsetFromToday % 2 === 0
      else if (freq === "weekdays") { const dow = date.getDay(); isActive = dow !== 0 && dow !== 6 }
      else isActive = true
    }

    let p
    if (platform !== "both") {
      p = platform
    } else if (focusPlatform === "youtube") {
      p = i % 10 < 7 ? "youtube" : "instagram"
    } else if (focusPlatform === "instagram") {
      p = i % 10 < 7 ? "instagram" : "youtube"
    } else {
      p = i % 3 === 0 ? "youtube" : i % 3 === 1 ? "instagram" : "both"
    }

    return {
      id: dayNum, day: dayNum,
      date: date.toISOString(),
      dateLabel: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      dayName: date.toLocaleDateString("en-IN", { weekday: "short" }),
      isToday,
      content: isActive ? buildFallbackContent(goalLabel, topicLabel, p === "both" ? "YouTube + Instagram" : p === "youtube" ? "YouTube" : "Instagram", dayNum, seed) : "",
      platform: p,
      contentType: isActive ? pickContentType(p === "both" ? "both" : p, dayNum, seed) : "",
      isCompleted: false,
      note: "",
      active: isActive,
    }
  })
}
