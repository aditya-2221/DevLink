import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt, { decode } from "jsonwebtoken"
import { Project } from "../models/project.model.js"
import { pipeline } from "stream"
import { Comments } from "../models/comments.model.js"

const createProject = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        techStack,
        githubLink,
        liveDemoLink,
        category
    } = req.body


    if (!title?.trim()) {
        throw new ApiError(400, "Title is required");
    }

    if (!description?.trim()) {
        throw new ApiError(400, "Description is required");
    }

    const uploadedImages = [];

    if (req.files?.length) {
        for (const file of req.files) {
            const image = await uploadOnCloudinary(file.path);

            if (!image) {
                throw new ApiError(500, "Image upload failed");
            }

            uploadedImages.push({
                url: image?.url,
                public_id: image.public_id
            });
        }
    }

    const project = await User.create({
        title,
        description,
        techStack,
        githubLink,
        liveDemoLink,
        category,
        images: uploadedImages,
        owner: req.user._id
    })

    return res.status(201).json(new ApiResponse(201, project, "Project Created successfully"))

})

const getAllProjects = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, search, category, sort = "latest" } = req.query

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    if (pageNumber < 1 || limitNumber < 1) {
        throw new ApiError(
            400,
            "Page and limit must be greater than 0"
        );
    }

    const skip = (pageNumber - 1) * limitNumber

    if (!["latest", "oldest"].includes(sort)) {
        throw new ApiError(
            400,
            "Invalid sort option"
        )
    }

    let sortOption = {}
    if (sort === "latest") {
        sortOption = {
            createdAt: -1
        }
    }

    else if (sort === "oldest") {
        sortOption = {
            createdAt: 1
        }
    }

    const filter = {}
    if (search?.trim()) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                techStack: {
                    $regex: search,
                    $options: "i"
                }
            }
        ]
    }

    if (category?.trim()) {
        filter.category = category
    }


    const totalProjects = await Project.countDocuments(filter)

    const projects = await Project.aggregate([
        {
            $match: filter
        },

        {
            $sort: sortOption
        },
        {
            $skip: skip
        },
        {
            $limit: limitNumber
        },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }

        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                likesCount: {
                    $size: "$likes"
                },
                isLiked: {
                    $in: [req.user._id, "$likes"]
                },
                isBookmarked: {
                    $in: [req.user._id, "$bookmarks"]
                }
            }
        },
        {
            $project: {
                _id: 1,

                title: 1,
                description: 1,

                category: 1,

                techStack: 1,

                githubLink: 1,
                liveDemoLink: 1,

                images: 1,

                owner: 1,

                likesCount: 1,
                isLiked: 1,

                isBookmarked: 1,

                createdAt: 1,
                updatedAt: 1
            }
        },

    ])

    const totalPages = Math.ceil(totalProjects / limitNumber)

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                projects,
                page: pageNumber,
                limit: limitNumber,
                totalProjects,
                totalPages
            },
            "Projects fetched successfully"
        )
    )
})

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project id");
    }


    const project = await Project.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(projectId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },

                likesCount: {
                    $size: "$likes"
                },

                isLiked: {
                    $in: [req.user._id, "$likes"]
                },
                isBookmarked: {
                    $in: [req.user._id, "$bookmarks"]
                }

            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                category: 1,
                techStack: 1,

                githubLink: 1,
                liveDemoLink: 1,

                images: 1,

                owner: 1,

                likesCount: 1,
                isLiked: 1,

                isBookmarked: 1,

                createdAt: 1
            }
        }
    ])

    const [projectData] = project;

    if (!projectData) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(new ApiResponse(200, projectData, "Project fetched successfully from project id"))

})

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const user = req.user

    const project = await Project.findById(projectId).populate("owner", "username fullName avatar")
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    if (user._id.toString() !== project.owner._id.toString()) {
        throw new ApiError(403, "Forbidden request to edit unowned project")
    }

    const {
        title,
        description,
        techStack,
        githubLink,
        liveDemoLink,
        category
    } = req.body;


    if (title?.trim()) {
        project.title = title;
    }

    if (description?.trim()) {
        project.description = description;
    }

    if (techStack) {
        project.techStack = techStack;
    }

    if (githubLink) {
        project.githubLink = githubLink;
    }

    if (liveDemoLink) {
        project.liveDemoLink = liveDemoLink;
    }

    if (category) {
        project.category = category;
    }


    if (req.files?.length) {
        for (const file of req.files) {
            const image = await uploadOnCloudinary(file.path);

            if (!image) {
                throw new ApiError(
                    500,
                    "Image upload failed"
                );
            }

            project.images.push({
                url: image.url,
                public_id: image.public_id
            });
        }
    }

    await project.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            project,
            "Project updated successfully"
        )
    );

})


const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const user = req.user

    const project = await Project.findById(projectId)
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    if (user._id.toString() !== project.owner.toString()) {
        throw new ApiError(403, "Forbidden request to delete unowned project")
    }

    if (project.images?.length > 0) {
        for (const image of project.images) {
            await deleteFromCloudinary(image.public_id)
        }
    }

    await project.deleteOne()

    return res.status(200).json(new ApiResponse(200, {}, "Project deleted successfully"))
})

const likeProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const user = req.user

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project id");
    }
    const project = await Project.findOneAndUpdate(
        {
            _id: projectId,
            likes: { $ne: user._id }
        },
        {
            $addToSet: {
                likes: user._id
            }
        },
        {
            new: true
        }
    )

    if (!project) {
        const exists = await Project.exists({ _id: projectId });

        if (!exists) {
            throw new ApiError(404, "Project not found");
        }
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likesCount: project?.likes.length ?? 0,
                isLiked: true
            },
            "Project liked successfully"
        )
    )


})

const unlikeProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project id");
    }

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            $pull: {
                likes: userId
            }
        },
        {
            new: true
        }
    );

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likesCount: project.likes.length,
                isLiked: false
            },
            "Project unliked successfully"
        )
    );
});

const addComment = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { content } = req.body
    const user = req.user

    if (!content?.trim()) {
        throw new ApiError(400, "Comment cannot be empty")
    }
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const comment = await Comments.create({
        content,
        owner: user._id,
        project: projectId
    })

    if (!comment) {
        throw new ApiError(500, "Comment creation failed")
    }
    await Project.findByIdAndUpdate(projectId, {
        $push: {
            comments: comment._id
        }
    })

    return res.status(201).json(new ApiResponse(201, comment, "Comment created successfully"))
})

const allComments = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { limit = 10, skip = 0 } = req.query

    const limitNumber = Math.max(Number(limit) || 10, 1);
    const skipNumber = Math.max(Number(skip) || 0, 0);

    const comments = await Comments.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: skipNumber
        },
        {
            $limit: limitNumber
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                content: 1,
                owner: 1,
                project: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }

    ])

    return res.status(200).json(new ApiResponse(200, {
        comments,
        count: comments.length
    }, "Comments fetched for the project"))


})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!content?.trim()) {
        throw new ApiError(400, "Comment cannot be updated to empty")
    }

    const comment = await Comments.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "No comment found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized comment update request")
    }

    comment.content = content.trim()
    await comment.save()

    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const comment = await Comments.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "No comment found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized comment delete request")
    }

    await Comments.findByIdAndDelete(commentId)

    await Project.findByIdAndUpdate(comment.project, {
        $pull: {
            comments: comment._id
        },

    }, { new: true })

    return res.status(204).json(new ApiResponse(204, {}, "Comment deleted successfully"))



})

const addBookmark = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    await Project.findByIdAndUpdate(
        projectId,
        {
            $addToSet: {
                bookmarks: req.user._id
            }
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Project bookmarked successfully"
        )
    );

})

const removeBookmark = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    await Project.findByIdAndUpdate(
        projectId,
        {
            $pull: {
                bookmarks: req.user._id
            }
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Bookmark removed successfully"
        )
    );
});

const getTrendingProjects = asyncHandler(async (req, res) => {
    const leaderboard = await Project.aggregate([
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                bookmarksCount: {
                    $size: "$bookmarks"
                },
                commentsCount: {
                    $size: "$comments"
                }
            }
        },
        {
            $addFields: {
                trendingScore: {
                    $add: [
                        { $multiply: ["$likesCount", 2] },
                        { $multiply: ["$bookmarksCount", 3] },
                        "$commentsCount"
                    ]
                }
            }
        },
        {
            $sort: {
                trendingScore: -1,
                createdAt: -1
            }
        },
        {
            $limit: 10
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        },
        {
            $project: {
                _id:1,
                title: 1,
                owner: 1,
                likesCount: 1,
                bookmarksCount: 1,
                commentsCount: 1,
                trendingScore: 1,
            }
        }
    ])


    return res.status(200).json(new ApiResponse(200, leaderboard, "Trending projects fetched successfully"))

})


export {
    createProject, getAllProjects, getProjectById, updateProject,
    deleteProject, likeProject, unlikeProject, addComment, allComments, updateComment, deleteComment, addBookmark, removeBookmark,getTrendingProjects
}