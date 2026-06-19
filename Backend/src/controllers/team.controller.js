import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt, { decode } from "jsonwebtoken"
import { Project } from "../models/project.model.js"
import { pipeline } from "stream"
import { Recruitment } from "../models/recruitment.model.js"
import { Application } from "../models/application.model.js"
import mongoose from "mongoose"
import { Team } from "../models/team.model.js"
import { Task } from "../models/task.model.js"
import { createNotification } from "./notification.controller.js"

const createTeam = asyncHandler(async (req, res) => {
    const { name, description, projectId } = req.body
    if (!name?.trim()) {
        throw new ApiError(400, "Team name is required")
    }
    if (!projectId) {
        throw new ApiError(400, "Project id is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project id")
    }
    const project = await Project.findById(projectId)
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    if (project.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbiddend request to create team")
    }

    const isExisting = await Team.findOne({
        project: projectId
    })
    if (isExisting) {
        throw new ApiError(400, "Team already exists")
    }

    const team = await Team.create({
        name,
        description,
        project: projectId,
        owner: req.user._id,
        members: [
            {
                user: req.user._id,
                role: "Lead"
            }
        ]
    }).populate("owner", "fullName username avatar")

    return res.status(201).json(new ApiResponse(201, team, "Team created successfully"))


})

const getMyTeams = asyncHandler(async (req, res) => {
    const teams = await Team.find({
        $or: [
            { owner: req.user._id },
            { "members.user": req.user._id }
        ]
    })
        .populate(
            "project",
            "title category"
        )
        .populate(
            "owner",
            "fullName username avatar"
        )
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(
            200,
            teams,
            "Teams fetched successfully"
        )
    )
})

const getTeamById = asyncHandler(async (req, res) => {
    const { teamId } = req.params
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team Id")
    }
    let team = await Team.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }
    let isOwner = false;

    if (team.owner.toString() === req.user._id.toString()) {
        isOwner = true
    }

    let isMember = false;

    for (const member of team.members) {
        if (member.user.toString() === req.user._id.toString()) {
            isMember = true
        }
    }

    if (!(isOwner || isMember)) {
        throw new ApiError(403, "Forbidden request to get teams by Id")
    }

    team = await Team.aggregate([
        {

            $match: {
                _id: new mongoose.Types.ObjectId(teamId)
            }

        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "owner",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "projects",
                foreignField: "_id",
                localField: "project",
                as: "project",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            category: 1
                        }
                    }
                ]
            }
        },
        {

            $lookup: {
                from: "users",
                localField: "members.user",
                foreignField: "_id",
                as: "memberDetails",
                pipeline: [
                    {
                        $project: {
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
                members: {
                    $map: {
                        input: "$members",
                        as: "member",
                        in: {
                            role: "$$member.role",

                            user: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$memberDetails",
                                            as: "user",
                                            cond: {
                                                $eq: [
                                                    "$$user._id",
                                                    "$$member.user"
                                                ]
                                            }
                                        }
                                    },
                                    0
                                ]
                            }
                        }
                    }
                },
                memberCount: {
                    $size: "$members"
                },

                owner: {
                    $first: "$owner"
                },
                project: {
                    $first: "$project"
                }

            }
        },
        {
            $addFields: {
                isOwner: {
                    $eq: [
                        "$owner._id",
                        req.user._id
                    ]
                },

                currentUserRole: {
                    $cond: [
                        { $eq: ["$owner._id", req.user._id] },
                        "Lead",
                        "Member"
                    ]
                }

            }
        },
        {

            $project: {
                memberDetails: 0
            }

        }
    ])

    const [teamData] = team
    if (!teamData) {
        throw new ApiError(404, "Team not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            teamData,
            "Team fetched successfully"
        )
    )

})

const updateTeam = asyncHandler(async (req, res) => {
    const { teamId } = req.params
    const { name, description } = req.body
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team Id")
    }
    let team = await Team.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }
    if (team.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbiddend request to update team")
    }
    if (!(name || description)) {
        throw new ApiError(400, "Atleast one field is required to update")
    }

    if (name !== undefined && !name.trim()) {
        throw new ApiError(400, "Team name is required")
    }

    if (name) {
        team.name = name.trim()
    }
    if (description !== undefined) {
        team.description = description
    }

    await team.save()

    return res.status(200).json(new ApiResponse(200, team, "Team updated successfully"))

})

const addMember = asyncHandler(async (req, res) => {
    const { teamId } = req.params
    const { userId } = req.body
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team ID")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    let team = await Team.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    if (team.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden request to add members")
    }
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    if (team.owner.toString() === userId) {
        throw new ApiError(400, "User is already the owner")
    }

    const isMember = team.members.some(
        member => member.user.toString() === userId
    )

    if (isMember) {
        throw new ApiError(400, "User is already a team member")
    }
    team.members.push({
        user: userId,
        role: "Member"
    })

    await team.save()
    await team.populate(
        "members.user",
        "fullName username avatar"
    )

    await createNotification({
        recipient: userId,
        sender: req.user._id,
        type: "TEAM_JOINED",
        message: `You have been added to ${team.name}`,
        referenceId: team._id
    })

    return res.status(200).json(new ApiResponse(200, team, "Member added successfully"))

})

const removeMember = asyncHandler(async (req, res) => {
    const { teamId, userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team ID")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    let team = await Team.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    if (team.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden request to remove members")
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isMember = team.members.some(
        member =>
            member.user.toString() === userId
    )

    if (team.owner.toString() === userId) {
        throw new ApiError(400, "Owner cannot be removed")
    }

    if (!isMember) {
        throw new ApiError(400, "User is not a team member")
    }

    team.members = team.members.filter(
        member => member.user.toString() !== userId
    )
    await team.save()

    await createNotification({
        recipient: userId,
        sender: req.user._id,
        type: "TEAM_REMOVED",
        message: `You have been removed from ${team.name}`,
        referenceId: team._id
    })
    await Task.updateMany(
        {
            team: teamId,
            assignedTo: userId
        },
        {
            $unset: {
                assignedTo: 1
            }
        }
    )
    return res.status(200).json(
        new ApiResponse(
            200,
            team,
            "Member removed successfully"
        )
    )

})

const createAnnouncement = asyncHandler(async (req, res) => {
    const { teamId } = req.params
    const { message } = req.body
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team ID")
    }
    let team = await Team.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }
    if (team.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden request to create announcements")
    }
    if (!message?.trim()) {
        throw new ApiError(400, "Message cannot be empty")
    }
    team.announcements.push({
        content: message.trim(),
        createdBy: req.user._id
    })

    await team.save()

    const announcement = team.announcements[team.announcements.length - 1]

    const announcementCreator =
        announcement.createdBy.toString()

    for (const member of team.members) {

        if (
            member.user.toString() ===
            announcementCreator
        ) {
            continue
        }

        await createNotification({
            recipient: member.user,
            sender: req.user._id,
            type: "TEAM_ANNOUNCEMENT",
            message: `New announcement in ${team.name}`,
            referenceId: announcement._id
        })
    }
    return res.status(200).json(new ApiResponse(200, announcement, "Announcement created successfully"))

})

const deleteTeam = asyncHandler(async (req, res) => {
    const { teamId } = req.params
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team ID")
    }
    let team = await Team.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }
    if (team.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden request to delete team")
    }

    for (const member of team.members) {

        if ( member.user.toString() === req.user._id.toString()) {
            continue
        }
        await createNotification({
            recipient: member.user,
            sender: req.user._id,
            type: "TEAM_DELETED",
            message: `${team.name} has been deleted`,
            referenceId: team._id
        })
    }

    await Task.deleteMany({
        team: teamId
    })

    await team.deleteOne()
    return res.status(200).json(new ApiResponse(200, {}, "Team deleted successfully"))
})

export { createTeam, getMyTeams, getTeamById, updateTeam, addMember, removeMember, createAnnouncement, deleteTeam }