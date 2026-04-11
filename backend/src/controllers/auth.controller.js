import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateTokens = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body

    if ([fullName, username, email, password].some(f => !f?.trim())) {
        throw new ApiError(400, "All fields are required")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format")
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters")
    }

    const existed = await User.findOne({ $or: [{ email }, { username }] })
    if (existed) throw new ApiError(400, "User already exists with this email or username")

    const avatarPath = req.files?.avatar?.[0]?.path
    let avatarUrl = ""
    if (avatarPath) {
        const uploaded = await uploadOnCloudinary(avatarPath)
        if (uploaded) avatarUrl = uploaded.url
    }

    const user = await User.create({
        fullName, username: username.toLowerCase(), email, password, avatar: avatarUrl
    })

    const created = await User.findById(user._id).select("-password -refreshToken")
    return res.status(201).json(new ApiResponse(201, created, "User registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body
    if (!email && !username) throw new ApiError(400, "Email or username is required")

    const user = await User.findOne({ $or: [{ email }, { username }] })
    if (!user) throw new ApiError(404, "User not found")

    const valid = await user.isPasswordCorrect(password)
    if (!valid) throw new ApiError(401, "Invalid credentials")

    const { accessToken, refreshToken } = await generateTokens(user._id)
    const loggedIn = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: loggedIn, accessToken, refreshToken }, "Logged in successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true })
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incoming = req.cookies.refreshToken || req.body.refreshToken
    if (!incoming) throw new ApiError(401, "Unauthorized")

    const decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decoded._id).select("-password -refreshToken -googleAccessToken -googleRefreshToken")
    if (!user) throw new ApiError(401, "User not found")

    // Verify token matches
    const dbUser = await User.findById(decoded._id)
    if (incoming !== dbUser.refreshToken) throw new ApiError(401, "Refresh token expired or used")

    const { accessToken, refreshToken } = await generateTokens(user._id)
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { accessToken, refreshToken, user }, "Token refreshed"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")
    if (!user) throw new ApiError(404, "User not found")
    return res.status(200).json(new ApiResponse(200, { user }, "User fetched"))
})

const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, username, email, niche, bio, goal, tone, platform } = req.body

    const updates = {}
    if (fullName !== undefined) updates.fullName = fullName.trim()
    if (niche !== undefined) updates.niche = niche
    if (bio !== undefined) updates.bio = bio
    if (goal !== undefined) updates.goal = goal
    if (tone !== undefined) updates.tone = tone
    if (platform !== undefined && ["youtube", "instagram", "both"].includes(platform)) {
        updates.platform = platform
    }

    // Check for duplicate email/username (excluding current user)
    if (username !== undefined) {
        const existing = await User.findOne({ username: username.toLowerCase(), _id: { $ne: req.user._id } })
        if (existing) throw new ApiError(400, "Username already taken")
        updates.username = username.toLowerCase()
    }
    if (email !== undefined) {
        const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } })
        if (existing) throw new ApiError(400, "Email already in use")
        updates.email = email.toLowerCase()
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true }
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, { user }, "Profile updated"))
})

const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) throw new ApiError(400, "Both passwords are required")
    if (newPassword.length < 6) throw new ApiError(400, "New password must be at least 6 characters")

    const user = await User.findById(req.user._id)
    const valid = await user.isPasswordCorrect(currentPassword)
    if (!valid) throw new ApiError(401, "Current password is incorrect")

    user.password = newPassword
    await user.save()

    return res.status(200).json(new ApiResponse(200, {}, "Password updated"))
})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarPath = req.file?.path
    if (!avatarPath) throw new ApiError(400, "Avatar file is required")

    const uploaded = await uploadOnCloudinary(avatarPath)
    if (!uploaded) throw new ApiError(500, "Failed to upload avatar")

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: uploaded.url } },
        { new: true }
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, { user }, "Avatar updated"))
})

const deleteAccount = asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.user._id)
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Account deleted"))
})

const saveCreatorProfile = asyncHandler(async (req, res) => {
    const { niche, format, goal, tone, audience, topic } = req.body
    const profile = {}
    if (niche !== undefined) profile["creatorProfile.niche"] = niche
    if (format !== undefined) profile["creatorProfile.format"] = format
    if (goal !== undefined) profile["creatorProfile.goal"] = goal
    if (tone !== undefined) profile["creatorProfile.tone"] = tone
    if (audience !== undefined) profile["creatorProfile.audience"] = audience
    if (topic !== undefined) profile["creatorProfile.topic"] = topic

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: profile },
        { new: true }
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, { user }, "Creator profile saved"))
})

export {
    registerUser, loginUser, logoutUser, refreshAccessToken,
    getCurrentUser, updateProfile, updatePassword, updateAvatar, deleteAccount, saveCreatorProfile
}
