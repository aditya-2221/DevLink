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
    },{timestamps:true}
)

projectSchema.index({
   owner:1
})

projectSchema.index({
   category:1
})

projectSchema.index({
   createdAt:-1
})


export const Project = mongoose.model("Project", projectSchema)

