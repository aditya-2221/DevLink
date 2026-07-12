import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["direct", "group"],
            required: true,
            index: true,
        },

        name: {
            type: String,
            trim: true,
            default: "",
        },

        image: {
            type: String,
            default: "",
        },

        participants: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                joinedAt: {
                    type: Date,
                    default: Date.now
                },

                lastReadMessage: {
                    type: Schema.Types.ObjectId,
                    ref: "Message",
                    default: null
                },

                isMuted: {
                    type: Boolean,
                    default: false
                },

                isArchived: {
                    type: Boolean,
                    default: false
                }
            }
        ],

        admins: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

        lastActivity: {
            type: Date,
            default: Date.now,
            index: true,
        },

        lastMessageAt: {
            type: Date,
            default: Date.now
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },

    {
        timestamps: true,
    }
);

conversationSchema.index({
    "participants.user": 1
});

conversationSchema.index({
    team: 1,
});

conversationSchema.index({
    lastActivity: -1,
});



conversationSchema.index(

    {

        team:1,

        type:1

    },

    {

        unique:true,

        partialFilterExpression:{

            type:"group"

        }

    }

);
    
export const Conversation = mongoose.model(
    "Conversation",
    conversationSchema
);