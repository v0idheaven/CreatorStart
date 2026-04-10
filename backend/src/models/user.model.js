import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        platform: {
            type: String,
            enum: ["youtube", "instagram", "both"],
            default: "both"
        },
        niche: { type: String, trim: true, default: "" },
        bio: { type: String, trim: true, default: "" },
        goal: { type: String, trim: true, default: "" },
        tone: { type: String, trim: true, default: "" },
        // Creator profile for generator auto-fill
        creatorProfile: {
            niche: { type: String, default: "" },
            format: { type: String, default: "" },
            goal: { type: String, default: "" },
            tone: { type: String, default: "" },
            audience: { type: String, default: "" },
            topic: { type: String, default: "" },
        },
        avatar: { type: String, default: "" },
        coverImage: { type: String, default: "" },
        // Google OAuth
        googleId: { type: String, default: "" },
        googleAccessToken: { type: String, default: "" },
        googleRefreshToken: { type: String, default: "" },
        // YouTube channel data
        youtubeChannelId: { type: String, default: "" },
        youtubeStats: { type: Object, default: null },
        youtubeStatsUpdatedAt: { type: Date, default: null },
        // Meta/Instagram OAuth
        metaId: { type: String, default: "" },
        metaAccessToken: { type: String, default: "" },
        instagramStats: { type: Object, default: null },
        instagramStatsUpdatedAt: { type: Date, default: null },
        refreshToken: { type: String }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)