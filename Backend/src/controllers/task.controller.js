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

const createTask = asyncHandler(async (req, res) => {
    const { title, description, teamId, assignedTo, priority, dueDate } = req.body
    if (!title?.trim()) {
        throw new ApiError(400, "Title for task is required")
    }
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team ID")
    }
    const team = await Team.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not Found")
    }
    let isOwner = false
    if (team.owner.toString() === req.user._id.toString()) {
        isOwner = true
    }

    let isMember = team.members.some(
        member => member.user.toString() === req.user._id.toString()
    )
    if (!(isMember || isOwner)) {
        throw new ApiError(403, "Unauthorized to create tasks")
    }

    if (assignedTo) {
        const assignedToUser = await User.findById(assignedTo)
        if (!assignedToUser) {
            throw new ApiError(404, "Assigned user not found")
        }

        const isAssignedOwner = team.owner.toString() === assignedTo

        const isAssignedMember =
            team.members.some(member => member.user.toString() === assignedTo)

        if (!(isAssignedOwner || isAssignedMember)) {
            throw new ApiError(
                400,
                "Assigned user is not part of the team"
            )
        }

    }

    if (priority && !["LOW", "MEDIUM", "HIGH"].includes(priority)) {
        throw new ApiError(400, "Priority passed is not defined")
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
        throw new ApiError(400, "Invalid due date")
    }

    const task = await Task.create({
        title: title.trim(),
        description,
        team: teamId,
        assignedTo,
        createdBy: req.user._id,
        priority,
        dueDate
    })
    if (assignedTo) {
        await createNotification({
            recipient: assignedTo,
            sender: req.user._id,
            type: "TASK_ASSIGNED",
            message: `You have been assigned task "${task.title}"`,
            referenceId: task._id
        })
    }

    return res.status(201).json(new ApiResponse(201, task, "Task created successfully"))

})

const getTasks = asyncHandler(async (req, res) => {
    const { teamId } = req.params
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team ID")
    }

    let team = await Team.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }
    const isOwner = team.owner.toString() === req.user._id.toString()

    let isMember = team.members.some(
        member => member.user.toString() === req.user._id.toString()
    )
    if (!(isMember || isOwner)) {
        throw new ApiError(403, "Unauthorized to view team tasks")
    }

    const tasks = await Task.aggregate([
        {
            $match: {
                team: new mongoose.Types.ObjectId(teamId)
            }

        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "createdBy",
                as: "createdBy",
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
                from: "users",
                foreignField: "_id",
                localField: "assignedTo",
                as: "assignedTo",
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
                assignedTo: {
                    $first: "$assignedTo"
                },

                createdBy: {
                    $first: "$createdBy"
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $facet: {
                todo: [
                    {
                        $match: {
                            status: "TODO"
                        }
                    }
                ],

                inProgress: [
                    {
                        $match: {
                            status: "IN_PROGRESS"
                        }
                    }
                ],

                done: [
                    {
                        $match: {
                            status: "DONE"
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                counts: {
                    todo: {
                        $size: "$todo"
                    },
                    inProgress: {
                        $size: "$inProgress"
                    },
                    done: {
                        $size: "$done"
                    }
                }
            }
        }

    ])

    const [taskData] = tasks

    return res.status(200).json(new ApiResponse(200, taskData, "Tasks fetched successfully"))

})

const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID")
    }

    const taskExists = await Task.findById(taskId)

    if (!taskExists) {
        throw new ApiError(404, "Task not found")
    }

    const team = await Team.findById(taskExists.team)

    if (!team) {
        throw new ApiError(
            404,
            "Team not found for the specified task"
        )
    }

    const isOwner =
        team.owner.toString() ===
        req.user._id.toString()

    const isMember =
        team.members.some(
            member =>
                member.user.toString() ===
                req.user._id.toString()
        )

    if (!(isOwner || isMember)) {
        throw new ApiError(
            403,
            "Unauthorized access to view task"
        )
    }

    const [task] = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
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
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
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
                from: "teams",
                localField: "team",
                foreignField: "_id",
                as: "team",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },

        {
            $addFields: {
                assignedTo: {
                    $first: "$assignedTo"
                },

                createdBy: {
                    $first: "$createdBy"
                },

                team: {
                    $first: "$team"
                }
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            task,
            "Task fetched successfully"
        )
    )
})

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { title, description, priority, dueDate } = req.body
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID")
    }

    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const team = await Team.findById(task.team)
    if (!team) {
        throw new ApiError(404, "Team not found for the specified task")
    }

   

    const canEdit =
        team.owner.toString() === req.user._id.toString() ||
        task.createdBy.toString() === req.user._id.toString() ||
        task.assignedTo?.toString() === req.user._id.toString()

    if (!canEdit) {
        throw new ApiError(403, "Unauthorized access to update task")
    }


    if (
        title === undefined &&
        description === undefined &&
        priority === undefined &&
        dueDate === undefined
    ) {
        throw new ApiError(400, "Atleast one field is required to update")
    }

    if (priority && !["LOW", "MEDIUM", "HIGH"].includes(priority)) {
        throw new ApiError(400, "Priority passed is not defined")
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
        throw new ApiError(400, "Invalid due date")
    }


    if (title !== undefined && !title.trim()) {
        throw new ApiError(400, "Title cannot be empty")
    }

    if (title) {
        task.title = title.trim()
    }

    if (description !== undefined) {
        task.description = description
    }

    if (priority) {
        task.priority = priority
    }

    if (dueDate) {
        task.dueDate = new Date(dueDate)
    }

    await task.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            task,
            "Task updated successfully"
        )
    )

})


const moveTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { status } = req.body
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID")
    }

    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const team = await Team.findById(task.team)
    if (!team) {
        throw new ApiError(404, "Team not found for the specified task")
    }

    const canEdit =
        team.owner.toString() === req.user._id.toString() ||
        task.createdBy.toString() === req.user._id.toString() ||
        task.assignedTo?.toString() === req.user._id.toString()

    if (!canEdit) {
        throw new ApiError(403, "Unauthorized access to update task")
    }

    if (!status) {
        throw new ApiError(400, "Status cannot be empty")
    }

    if (!["TODO", "IN_PROGRESS", "DONE"].includes(status.toUpperCase())) {
        throw new ApiError(400, "Invalid status value passed")
    }

    if (task.status === status.toUpperCase()) {
        throw new ApiError(400, "Status is unchanged")
    }
    task.status = status.toUpperCase()
    await task.save()
    return res.status(200).json(
        new ApiResponse(
            200,
            task,
            "Task status updated successfully"
        )
    )
})

const assignTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { assignedTo } = req.body
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID")
    }

    if (!assignedTo) {
        throw new ApiError(400, "No id passed to assign")
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        throw new ApiError(400, "Invalid user ID to assign")
    }

    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const team = await Team.findById(task.team)
    if (!team) {
        throw new ApiError(404, "Team not found for the specified task")
    }

    const isOwner = team.owner.toString() === req.user._id.toString()

    if (!isOwner) {
        throw new ApiError(403, "Unauthorized access to assign task")
    }

    const assignUser = await User.findById(assignedTo)
    if (!assignUser) {
        throw new ApiError(404, "User not found to assign task")
    }

    const isAssignMember = team.members.some(member => member.user.toString() === assignedTo)
    const isAssignOwner = team.owner.toString() === assignedTo
    if (!(isAssignMember || isAssignOwner)) {
        throw new ApiError(403, "Assigned person is not a team member or owner")
    }

    if (
        task.assignedTo && task.assignedTo.toString() === assignedTo) {
        throw new ApiError(
            400,
            "Task already assigned to this user"
        )
    }

    task.assignedTo = assignedTo
    await task.save()
    await task.populate(
        "assignedTo",
        "fullName username avatar"
    )

    await createNotification({
        recipient: assignedTo,
        sender: req.user._id,
        type: "TASK_ASSIGNED",
        message: `You have been assigned task "${task.title}"`,
        referenceId: task._id
    })

    return res.status(200).json(new ApiResponse(200, task, "Task assigned successfully"))

})

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID")
    }

    const task = await Task.findById(taskId)

    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const team = await Team.findById(task.team)

    if (!team) {
        throw new ApiError(
            404,
            "Team not found for the specified task"
        )
    }

    const canEdit =team.owner.toString() === req.user._id.toString() || task.createdBy.toString() === req.user._id.toString() 
    if (!canEdit) {
        throw new ApiError(403, "Unauthorized access to delete task")
    }

    await task.deleteOne()

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Task deleted successfully"
        )
    )
})

export { createTask, getTaskById, getTasks, updateTask, moveTask, assignTask, deleteTask }