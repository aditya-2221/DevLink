import mongoose, { Schema } from "mongoose";

const attachmentSchema = new Schema(
    {
        url: {
            type: String,
            required: true
        },

        public_id: {
            type: String,
            required: true
        },

        fileName: {
            type: String,
            required: true
        },

        fileType: {
            type: String,
            required: true
        },

        size: {
            type: Number,
            required: true
        },

        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        uploadedAt: {
            type: Date,
            default: Date.now
        },
        resourceType:{
            type:String,
            required:true
        }
    },
    {
        _id: true
    }
);

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: [
                "TODO",
                "IN_PROGRESS",
                "DONE"
            ],
            default: "TODO"
        },

        priority: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH"
            ],
            default: "MEDIUM"
        },

        dueDate: {
            type: Date
        },

        attachments: [attachmentSchema]
    },
    {
        timestamps: true
    }
);

taskSchema.index({
    team: 1
});

taskSchema.index({
    assignedTo: 1
});

taskSchema.index({
    status: 1
});

export const Task = mongoose.model("Task", taskSchema);