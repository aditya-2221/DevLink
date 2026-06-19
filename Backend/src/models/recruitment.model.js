import mongoose, { Schema } from "mongoose";

const recruitmentSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

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
            required: true
        },

        requiredSkills: [
            {
                type: String,
                trim: true
            }
        ],

        positions: {
            type: Number,
            default: 1
        },

        status: {
            type: String,
            enum: ["OPEN", "CLOSED"],
            default: "OPEN"
        },
        acceptedCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);
recruitmentSchema.index({
    status: 1
})

recruitmentSchema.index({
    owner: 1
})
export const Recruitment = mongoose.model(
    "Recruitment",
    recruitmentSchema
);