import mongoose, { Schema } from "mongoose"

const postSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        platform: {
            type: String,
            enum: ["youtube", "instagram"],
            required: true
        },
        day: {
            type: Number,
            min: 1,
            max: 30
        },
        status: {
            type: String,
            enum: ["idea", "in-progress", "done"],
            default: "idea"
        },
        thumbnail: {
            type: String,
        }
    },
    { timestamps: true }
)

export const Post = mongoose.model("Post", postSchema)
