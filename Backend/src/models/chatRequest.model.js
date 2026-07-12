import mongoose, { Schema } from "mongoose";

const chatRequestSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        message: {
            type: String,
            maxlength: 250,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "blocked",
            ],
            default: "pending",
        },

        conversation: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            default: null
        }
    },
    {
        timestamps: true,
    }
);

chatRequestSchema.index({
    sender: 1,
    receiver: 1,
    createdAt: -1
});

chatRequestSchema.index({
    receiver: 1,
    status: 1,
});

export const ChatRequest = mongoose.model(
    "ChatRequest",
    chatRequestSchema
);