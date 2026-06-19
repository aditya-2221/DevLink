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
import { Notification } from "../models/notification.model.js"

const VALID_NOTIFICATION_TYPES = [
    "APPLICATION_RECEIVED",
    "APPLICATION_ACCEPTED",
    "APPLICATION_REJECTED",
    "PROJECT_LIKED",
    "PROJECT_COMMENTED",
    "TEAM_JOINED",
    "TEAM_ANNOUNCEMENT",
    "TASK_ASSIGNED",
    "TEAM_REMOVED",
    "TEAM_DELETED",
    "PROJECT_DELETED"
]

const createNotification = async ({
    recipient,
    sender,
    type,
    message,
    referenceId
}) => {
    if (!recipient) {
        throw new ApiError(400, "Recipient not passed")
    }
    if (!mongoose.Types.ObjectId.isValid(recipient)) {
        throw new ApiError(400, "Invalid recipient ID")
    }

    if (sender && !mongoose.Types.ObjectId.isValid(sender)) {
        throw new ApiError(400, "Invalid Sender ID")
    }

    if (referenceId && !mongoose.Types.ObjectId.isValid(referenceId)) {
        throw new ApiError(400, "Reference id is invalid")
    }

    if (!type) {
        throw new ApiError(400, "Type cannot be missing")
    }

    type = type.toUpperCase()

    if (type && !VALID_NOTIFICATION_TYPES.includes(type)) {
        throw new ApiError(400, "Value of type is invalid")
    }
    if (!message?.trim()) {
        throw new ApiError(400, "Message cannot be empty")
    }
    if (sender && sender?.toString() === recipient?.toString()) {
        return null
    }

    const notification = await Notification.create({
        recipient,
        sender,
        type,
        message: message.trim(),
        referenceId
    })
    return notification
}

const getMyNotifications = asyncHandler(async (req, res) => {
    const { skip, limit } = req.query
    const limitNumber = Number(limit) || 20
    const skipNumber = Number(skip) || 0

    if (limitNumber < 1 || limitNumber > 50) {
        throw new ApiError(400, "Invalid limit")
    }

    if (skipNumber < 0) {
        throw new ApiError(400, "Invalid skip")
    }

    const recipient = req.user._id
    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false
    })

    const totalCount = await Notification.countDocuments({
        recipient: req.user._id
    })


    const myNotifications = await Notification.aggregate([
        {
            $match: {
                recipient: new mongoose.Types.ObjectId(recipient)
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
                foreignField: "_id",
                localField: "sender",
                as: "sender",
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
                sender: {
                    $first: "$sender"
                }
            }
        }
    ])

    const hasMore = skipNumber + myNotifications.length < totalCount

    return res.status(200).json(new ApiResponse(200, {
        myNotifications,
        hasMore,
        unreadCount
    }, "My notifications fetched successfully"))

})

const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        throw new ApiError(400, "Invalid notification Id")
    }

    const notification = await Notification.findById(notificationId)
    if (!notification) {
        throw new ApiError(404, "Notification not found")
    }
    if (notification.recipient.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden access to this notification")
    }
    if (notification.isRead) {
        return res.status(200).json(
            new ApiResponse(
                200,
                notification,
                "Notification already marked as read"
            )
        )
    }

    notification.isRead = true
    await notification.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            notification,
            "Notification marked as read"
        )
    )

})

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {

    const readNotifications = await Notification.updateMany({
        recipient: req.user._id,
        isRead: false
    }, {
        $set: {
            isRead: true
        }
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "All notifications marked as read"
        )
    )



})

const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        throw new ApiError(400, "Invalid notification ID")
    }
    const notification = await Notification.findById(notificationId)
    if (!notification) {
        throw new ApiError(404, "Notification not found")
    }
    if (notification.recipient.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden access to delete notification")
    }
    await notification.deleteOne()
    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Notification deleted successfully"
        )
    )
})

export { createNotification, getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification }