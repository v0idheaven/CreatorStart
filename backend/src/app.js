import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

import authRouter from './routes/auth.routes.js'
import plannerRouter from './routes/planner.routes.js'

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/planner', plannerRouter)

export { app }
