import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
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

app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({ ok: true })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/planner', plannerRouter)

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
