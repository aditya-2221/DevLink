import mongoose from "mongoose";
import path from "path";

import { Resource } from "../models/resource.model.js";
import { Team } from "../models/team.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
    uploadOnCloudinary,
    deleteFromCloudinary
} from "../utils/cloudinary.js";

import { createNotification } from "./notification.controller.js";

const uploadResource = asyncHandler(async (req, res) => {

    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team id");
    }

    const team = await Team.findById(teamId);

    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    const isOwner = team.owner.toString() === req.user._id.toString();

    const isMember = team.members.some(
        member => member.user.toString() === req.user._id.toString()
    );

    if (!(isOwner || isMember)) {
        throw new ApiError(
            403,
            "Unauthorized to upload resources"
        );
    }

    if (!req.files || req.files.length === 0) {
        throw new ApiError(
            400,
            "Please upload at least one file"
        );
    }

    const uploadedResources = [];

    for (const file of req.files) {

        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (!cloudinaryResponse) {
            continue;
        }

        const mimeType = file.mimetype;

        let resourceType = "other";

        if (mimeType.startsWith("image/")) {
            resourceType = "image";
        } else if (mimeType.startsWith("video/")) {
            resourceType = "video";
        } else if (mimeType === "application/pdf") {
            resourceType = "pdf";
        } else if (
            mimeType.includes("word") ||
            mimeType.includes("document")
        ) {
            resourceType = "word";
        } else if (
            mimeType.includes("excel") ||
            mimeType.includes("spreadsheet")
        ) {
            resourceType = "excel";
        } else if (
            mimeType.includes("zip") ||
            mimeType.includes("rar")
        ) {
            resourceType = "archive";
        }

        const resource = await Resource.create({

            team: team._id,

            uploadedBy: req.user._id,

            fileName: file.originalname,

            originalName: file.originalname,

            url: cloudinaryResponse.secure_url,

            public_id: cloudinaryResponse.public_id,

            resourceType,

            mimeType,

            extension: path.extname(file.originalname),

            size: file.size

        });

        uploadedResources.push(resource);

    }

    for (const member of team.members) {

        if (
            member.user.toString() ===
            req.user._id.toString()
        ) continue;

        await createNotification({

            recipient: member.user,

            sender: req.user._id,

            type: "TEAM_RESOURCE",

            message: `${req.user.fullName} uploaded new resource(s) in ${team.name}`,

            referenceId: team._id

        });

    }

    return res.status(201).json(

        new ApiResponse(

            201,

            uploadedResources,

            "Resources uploaded successfully"

        )

    );

});

const getResources = asyncHandler(async (req, res) => {

    const { teamId } = req.params;

    const {
        search = "",
        type = "ALL",
        sort = "latest"
    } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new ApiError(400, "Invalid team id");
    }

    const team = await Team.findById(teamId);

    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    const isOwner = team.owner.toString() === req.user._id.toString();

    const isMember = team.members.some(
        member => member.user.toString() === req.user._id.toString()
    );

    if (!(isOwner || isMember)) {
        throw new ApiError(
            403,
            "Unauthorized"
        );
    }

    const match = {
        team: new mongoose.Types.ObjectId(teamId)
    }

    if (search) {

        match.fileName = {

            $regex: search,

            $options: "i"

        };

    }

    if (type !== "ALL") {

        match.resourceType = type;

    }

    const sortOptions = {

        latest: { createdAt: -1 },

        oldest: { createdAt: 1 },

        name: { fileName: 1 },

        size: { size: -1 }

    };

    const resources = await Resource.aggregate([

        {

            $match: match

        },

        {

            $lookup: {

                from: "users",

                localField: "uploadedBy",

                foreignField: "_id",

                as: "uploadedBy",

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

                uploadedBy: {

                    $first: "$uploadedBy"

                }

            }

        },

        {

            $sort: sortOptions[sort] || sortOptions.latest

        },

        {

            $facet: {

                resources: [

                    {

                        $skip:

                            (page - 1) * limit

                    },

                    {

                        $limit:

                            Number(limit)

                    }

                ],

                total: [

                    {

                        $count: "count"

                    }

                ]

            }

        }

    ]);

    const data = resources[0];

    return res.status(200).json(

        new ApiResponse(

            200,

            {

                resources: data.resources,

                total:

                    data.total[0]?.count || 0,

                totalPages: Math.ceil(

                    (data.total[0]?.count || 0)

                    / limit

                )

            },

            "Resources fetched successfully"

        )

    );

});

const deleteResource = asyncHandler(async (req, res) => {

    const { resourceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {

        throw new ApiError(400, "Invalid resource id");

    }

    const resource = await Resource.findById(resourceId);

    if (!resource) {

        throw new ApiError(404, "Resource not found");

    }

    const team = await Team.findById(resource.team);

    if (!team) {

        throw new ApiError(404, "Team not found");

    }

    const canDelete =

        team.owner.toString() === req.user._id.toString() || resource.uploadedBy.toString() === req.user._id.toString();

    if (!canDelete) {

        throw new ApiError(

            403,

            "Unauthorized"

        );

    }

    await deleteFromCloudinary(

        resource.public_id,

        resource.resourceType

    );

    await resource.deleteOne();

    return res.status(200).json(

        new ApiResponse(

            200,

            {},

            "Resource deleted successfully"

        )

    );

});

const incrementDownloads = asyncHandler(async (req, res) => {

    const { resourceId } = req.params;

    const resource = await Resource.findByIdAndUpdate(

        resourceId,

        {

            $inc: {

                downloads: 1

            }

        },

        {

            new: true

        }

    );

    return res.status(200).json(

        new ApiResponse(

            200,

            resource,

            "Download count updated"

        )

    );

});

export { uploadResource, getResources, deleteResource, incrementDownloads };