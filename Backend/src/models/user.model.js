
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            trim: true,
            index: true,
        },

        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            trim: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        bio: {
            type: String,
            default: "",
            maxlength: 300,
            trim: true,
        },

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        education: [
            {
                institution: {
                    type: String,
                    required: true,
                    trim: true
                },

                degree: {
                    type: String,
                    required: true,
                    trim: true
                },

                fieldOfStudy: {
                    type: String,
                    trim: true
                },

                startYear: {
                    type: Number,
                    required: true
                },

                endYear: {
                    type: Number,
                    default: null
                }
            }
        ],


        badges: [
            {
                type: String,
                enum: [
                    "devlink-developer",
                    "top-contributor",
                    "elite-developer"
                ]
            }
        ],
        isVerified: {
            type: Boolean,
            default: false
        },

        portfolio: {
            type: String,
            default: "",
            trim: true,
        },

        github: {
            type: String,
            default: "",
            trim: true,
        },

        linkedin: {
            type: String,
            default: "",
            trim: true,
        },

        location: {
            type: String,
            default: "",
            trim: true,
        },

        avatar: {
            type: String,
            required: true,
        },

        coverImage: {
            type: String,
            default: "",
        },

        messagePrivacy: {
            type: String,
            enum: ["everyone", "connections", "requests"],
            default: "requests",
        },


        password: {
            type: String,
            required: [true, "Password is Required"],
        },

        refreshToken: {
            type: String,
        },
        passwordResetToken: {
            type: String,
            default: null,
        },

        passwordResetExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10)


})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
userSchema.index({
    skills: 1
});

userSchema.index({
    location: 1
});

userSchema.index({
    bio: "text",
    fullName: "text",
    username: "text"
});

export const User = mongoose.model("User", userSchema)