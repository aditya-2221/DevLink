import mongoose, { Schema } from "mongoose";

const teamInvitationSchema = new Schema(
    {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
            index: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "cancelled"
            ],
            default: "pending",
            index: true
        },

        message: {
            type: String,
            trim: true,
            maxlength: 250,
            default: ""
        }
    },
    {
        timestamps: true
    }
);


teamInvitationSchema.index(
    {
        team: 1,
        receiver: 1,
        status: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            status: "pending"
        }
    }
);

export const TeamInvitation = mongoose.model(
    "TeamInvitation",
    teamInvitationSchema
);