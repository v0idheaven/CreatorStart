import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import authRouter from './routes/auth.routes.js'
import plannerRouter from './routes/planner.routes.js'

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://creator-start.vercel.app",
    "https://creatorstart.in",
    "https://www.creatorstart.in",
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error(`CORS blocked for origin: ${origin}`), false)
    },
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // generous for normal usage (login, profile updates, etc)
    message: { success: false, message: "Too many requests, please try again later." },
    standardHeaders: true, legacyHeaders: false,
    skip: (req) => {
        // Don't rate limit profile/settings updates — only login/register
        const sensitiveRoutes = ["/login", "/register"]
        return !sensitiveRoutes.some(r => req.path.includes(r))
    }
})

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // strict only for login/register
    message: { success: false, message: "Too many login attempts, please try again later." },
    standardHeaders: true, legacyHeaders: false,
})

const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 15, // slightly more generous
    message: { success: false, message: "Too many AI requests, please slow down." },
    standardHeaders: true, legacyHeaders: false,
})

app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({ ok: true })
})

app.use('/api/v1/auth', authLimiter, authRouter)
app.use('/api/v1/auth/login', loginLimiter)
app.use('/api/v1/auth/register', loginLimiter)
app.use('/api/v1/planner', aiLimiter, plannerRouter)

app.use((err, _req, res, _next) => {
    const statusCode = err?.statusCode || 500
    // Strip HTML tags from error messages (e.g. YouTube API quota errors contain HTML links)
    const rawMessage = err?.message || "Internal Server Error"
    const message = rawMessage.replace(/<[^>]*>/g, "").trim()
    return res.status(statusCode).json({
        success: false,
        message,
        errors: err?.errors || []
    })
})

export { app }
