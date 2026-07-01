import mongoose, { Schema } from "mongoose";

const resourceSchema = new Schema(
    {
        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
            required: true,
            index: true
        },

        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        fileName: {
            type: String,
            required: true,
            trim: true
        },

        originalName: {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        },

        public_id: {
            type: String,
            required: true
        },

        resourceType: {
            type: String,
            required: true
        },

        mimeType: {
            type: String,
            required: true
        },

        extension: {
            type: String,
            required: true
        },

        size: {
            type: Number,
            required: true
        },

        downloads: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

resourceSchema.index({
    team: 1,
    createdAt: -1
});

resourceSchema.index({
    uploadedBy: 1
});

resourceSchema.index({
    fileName: "text"
});

export const Resource = mongoose.model(
    "Resource",
    resourceSchema
);