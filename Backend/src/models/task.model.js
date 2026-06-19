import mongoose,{Schema} from "mongoose"

const taskSchema = new mongoose.Schema(
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
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
    }
},
{
    timestamps: true
})
taskSchema.index({
    team: 1
})

taskSchema.index({
    assignedTo: 1
})

taskSchema.index({
    status: 1
})

export const Task = mongoose.model("Task",taskSchema)