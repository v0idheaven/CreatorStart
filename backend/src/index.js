import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config()
// v2 - analytics metrics fix

// Validate required environment variables before starting
const REQUIRED_ENV = ["MONGODB_URI", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET", "GROQ_API_KEY"]
for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`FATAL: Missing required environment variable: ${key}`)
        process.exit(1)
    }
}

const PORT = process.env.PORT || 10000

connectDB()
.then(() => {
    app.listen(PORT, () => {
        if (process.env.NODE_ENV !== "production") {
            console.log(`Server running on port: ${PORT}`)
        }
    })
})
.catch((err) => {
    console.error("MongoDB connection failed:", err)
    process.exit(1)
})
