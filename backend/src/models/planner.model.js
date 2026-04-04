import mongoose, { Schema } from "mongoose"

const plannerSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        platform: {
            type: String,
            enum: ["youtube", "instagram", "both"],
            required: true
        },
        planData: {
            type: Schema.Types.Mixed,
            default: null
        },
        streakData: {
            type: Schema.Types.Mixed,
            default: []
        }
    },
    { timestamps: true }
)

plannerSchema.index({ owner: 1, platform: 1 }, { unique: true })

export const Planner = mongoose.model("Planner", plannerSchema)
