import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CORS_ORIGIN
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({ ok: true })
})

import authRouter from './routes/auth.routes.js'
import plannerRouter from './routes/planner.routes.js'

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/planner', plannerRouter)

app.use((err, _req, res, _next) => {
    const statusCode = err?.statusCode || 500
    const message = err?.message || 'Internal Server Error'

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err?.errors || []
    })
})

export { app }
