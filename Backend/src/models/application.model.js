import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
    {
        recruitment: {
            type: Schema.Types.ObjectId,
            ref: "Recruitment",
            required: true
        },

        applicant: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "ACCEPTED",
                "REJECTED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    {
        recruitment: 1,
        applicant: 1
    },
    {
        unique: true
    }
);

export const Application = mongoose.model(
    "Application",
    applicationSchema
);