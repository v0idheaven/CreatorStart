import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        if (process.env.NODE_ENV !== "production") {
            console.log(`\nMongoDB connected!! HOST: ${connectionInstance.connection.host}`)
        }
    }
    catch (error) {
        console.error("MongoDB connection error:", error)
        process.exit(1)
    }
}

export default connectDB;