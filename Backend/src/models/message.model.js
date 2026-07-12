import mongoose, { Schema } from "mongoose";


const readSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        readAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const attachmentSchema = new Schema(
    {
        url: String,

        public_id: String,

        name: String,

        size: Number,

        mimeType: String,

        extension: String
    },
    {
        _id: false,
    }
);

const messageSchema = new Schema(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },

        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "TEXT",
                "IMAGE",
                "FILE",
            ],
            default: "TEXT",
        },

        content: {
            type: String,
            trim: true,
            default: "",
        },

        attachments: [attachmentSchema],

        replyTo: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

       
        readBy: [readSchema],

        edited: {
            type: Boolean,
            default: false,
        },

        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({
    conversation: 1,
    deleted: 1,
    createdAt: -1
});

messageSchema.index({
    conversation: 1,
    createdAt: -1,
});

messageSchema.index({
    sender: 1,
});

messageSchema.index({
    content: "text",
});

export const Message = mongoose.model(
    "Message",
    messageSchema
);