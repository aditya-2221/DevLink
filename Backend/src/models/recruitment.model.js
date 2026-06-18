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
        }
    },
    {
        timestamps: true
    }
);

export const Recruitment = mongoose.model(
    "Recruitment",
    recruitmentSchema
);