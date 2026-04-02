import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config()

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.error("MongoDB connection failed:", err)
    process.exit(1)
})
