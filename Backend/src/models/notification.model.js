import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        type: {
            type: String,
            enum: [
                "APPLICATION_RECEIVED",
                "APPLICATION_ACCEPTED",
                "APPLICATION_REJECTED",
                "PROJECT_LIKED",
                "PROJECT_COMMENTED",
                "TEAM_JOINED",
                "TEAM_ANNOUNCEMENT",
                "TEAM_RESOURCE",
                "TASK_ASSIGNED",
                "TASK_ATTACHMENT",
                "TASK_ATTACHMENT_REMOVED",
                "TEAM_REMOVED",
                "TEAM_DELETED",
                "PROJECT_DELETED"
            ],
            required: true
        },

        message: {
            type: String,
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId
        }
    },
    { timestamps: true }
);

notificationSchema.index({
    recipient: 1
})

notificationSchema.index({
    recipient: 1,
    isRead: 1
})

export const Notification = mongoose.model("Notification", notificationSchema);