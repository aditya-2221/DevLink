import mongoose, { Schema } from "mongoose";

const taskActivitySchema = new Schema(
    {
        task: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        action: {
            type: String,
            enum: [
                "TASK_CREATED",
                "TITLE_UPDATED",
                "DESCRIPTION_UPDATED",
                "PRIORITY_UPDATED",
                "DUE_DATE_UPDATED",
                "STATUS_CHANGED",
                "TASK_ASSIGNED",
                "ATTACHMENT_UPLOADED",
                "ATTACHMENT_REMOVED"
            ],
            required: true
        },

    metadata: {
            type: Schema.Types.Mixed,
            default: {}
        }

    },
    {
        timestamps: true
    });

export const TaskActivity = mongoose.model(
    "TaskActivity",
    taskActivitySchema
);