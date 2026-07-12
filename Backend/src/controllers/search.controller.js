import mongoose from "mongoose";

import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Team } from "../models/team.model.js";
import { TeamInvitation } from "../models/teamInvitation.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const globalSearch = asyncHandler(async (req, res) => {

    const {
        q = "",
        type = "all",
        page = 1,
        limit = 5,
        excludeTeam
    } = req.query

    const search = q.trim();

    if (!search) {
        throw new ApiError(
            400,
            "Search query is required"
        );
    }

    const pageNumber = Math.max(Number(page), 1);

    const limitNumber = Math.max(Number(limit), 1);

    const skip = (pageNumber - 1) * limitNumber;

    let excludedUsers = [];

    if (
        excludeTeam &&
        mongoose.Types.ObjectId.isValid(excludeTeam)
    ) {

        const team = await Team.findById(excludeTeam);

        if (team) {

            excludedUsers.push(team.owner);

            team.members.forEach(member => {
                excludedUsers.push(member.user);
            });

            const pendingInvites =
                await TeamInvitation.find({
                    team: excludeTeam,
                    status: "pending"
                }).select("receiver");

            pendingInvites.forEach(invite => {
                excludedUsers.push(invite.receiver);
            });

            excludedUsers = [
                ...new Set(
                    excludedUsers.map(id => id.toString())
                )
            ].map(id =>
                new mongoose.Types.ObjectId(id)
            );

        }

    }

    const allowedTypes = [
        "all",
        "users",
        "projects"
    ];

    if (!allowedTypes.includes(type)) {

        throw new ApiError(
            400,
            "Invalid search type"
        );

    }


    let users = [];

    if (type === "all" || type === "users") {

        users = await User.aggregate([
            {
                $match: {

                    _id: {
                        $nin: excludedUsers
                    },

                    $or: [

                        {
                            fullName: {
                                $regex: search,
                                $options: "i"
                            }
                        },

                        {
                            username: {
                                $regex: search,
                                $options: "i"
                            }
                        },

                        {
                            bio: {
                                $regex: search,
                                $options: "i"
                            }
                        },

                        {
                            location: {
                                $regex: search,
                                $options: "i"
                            }
                        },

                        {
                            skills: {
                                $regex: search,
                                $options: "i"
                            }
                        }

                    ]

                }

            },

            {
                $lookup: {

                    from: "projects",

                    localField: "_id",

                    foreignField: "owner",

                    as: "projects"

                }

            },

            {

                $addFields: {

                    projectsCount: {

                        $size: "$projects"

                    }

                }

            },

            {

                $project: {

                    password: 0,

                    refreshToken: 0,

                    email: 0,

                    projects: 0

                }

            },

            {
                $sort: {

                    isVerified: -1,

                    projectsCount: -1,

                    fullName: 1

                }
            },

            {
                $skip: skip
            },

            {
                $limit: limitNumber
            }

        ])
    }





    let projects = [];

    if (type === "all" || type === "projects") {

        projects = await Project.aggregate([
            {

                $match: {

                    $or: [

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

                        },

                        {

                            category: {

                                $regex: search,

                                $options: "i"

                            }

                        }

                    ]

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

                                fullName: 1,

                                username: 1,

                                avatar: 1,

                                isVerified: 1

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

                    commentsCount: {

                        $size: "$comments"

                    },

                    bookmarksCount: {

                        $size: "$bookmarks"

                    },

                    thumbnail: {

                        $arrayElemAt: [

                            "$images",

                            0

                        ]

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

                    createdAt: 1,

                    owner: 1,

                    likesCount: 1,

                    commentsCount: 1,

                    bookmarksCount: 1,

                    thumbnail: 1

                }

            },

            {

                $sort: {

                    likesCount: -1,

                    createdAt: -1

                }

            },

            {

                $skip: skip

            },

            {

                $limit: limitNumber

            }

        ])
    }
    let usersCount = 0;

    if (
        type === "all" ||
        type === "users"
    ) {

        usersCount =
            await User.countDocuments({

                $or: [

                    {
                        fullName: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        username: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        bio: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        location: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        skills: {
                            $regex: search,
                            $options: "i"
                        }
                    }

                ]

            });

    }

    let projectsCount = 0;

    if (
        type === "all" ||
        type === "projects"
    ) {

        projectsCount =
            await Project.countDocuments({

                $or: [

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
                    },

                    {
                        category: {
                            $regex: search,
                            $options: "i"
                        }
                    }

                ]

            });

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            {

                query: search,

                users,

                projects,

                pagination: {

                    page: pageNumber,

                    limit: limitNumber,

                    usersCount,

                    projectsCount,

                    totalResults:
                        usersCount +
                        projectsCount,

                    totalPages: Math.ceil(
                        Math.max(
                            usersCount,
                            projectsCount
                        ) / limitNumber
                    )

                }

            },

            "Search results fetched successfully"

        )

    );

});

export {
    globalSearch
};