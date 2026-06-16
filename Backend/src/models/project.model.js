import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        techStack: [{
            type: String
        }],
        githubLink: String,

        liveDemoLink: String,

        images: [{
            url: String,
            public_id: String
        }],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comments"
            }
        ],
        bookmarks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        category: {
            type: String,
            enum: [
                "Web Development",
                "Mobile Development",
                "AI/ML",
                "Blockchain",
                "Open Source",
                "Game Development",
                "Cybersecurity",
                "DevOps",
                "Other"
            ],
            default: "Other"
        },
    }
)


export const Project = mongoose.model("Project", projectSchema)

