import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        role: {
            type: String,
            enum: ["Owner", "Lead", "Member"]
        }
    }],

    announcements: [

        {

            title: {
                type: String,
                required: true,
                trim: true
            },

            content: {
                type: String,
                required: true,
                trim: true
            },

            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },

            isPinned: {
                type: Boolean,
                default: false
            },

            createdAt: {
                type: Date,
                default: Date.now
            }

        }

    ]
}, { timestamps: true })


teamSchema.index({
    project: 1,
    name: 1
}, {
    unique: true
})
teamSchema.index({
    owner: 1
})

teamSchema.index({
    "members.user": 1
})

export const Team = mongoose.model("Team", teamSchema)