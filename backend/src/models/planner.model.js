import mongoose, { Schema } from "mongoose"

const plannerSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        day: {
            type: Number,
            required: true,
            min: 1,
            max: 30
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        platform: {
            type: String,
            enum: ["youtube", "instagram", "both"],
            required: true
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

export const Planner = mongoose.model("Planner", plannerSchema)