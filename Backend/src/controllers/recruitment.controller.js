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

const createRecruitment = asyncHandler(async (req, res) => {
    const {
        projectId,
        title,
        description,
        requiredSkills,
        positions
    } = req.body

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    if (project.owner.toString() !== req.user._id.toString) {
        throw new ApiError(
            403,
            "Only project owner can recruit"
        );
    }

    const recruitment =
        await Recruitment.create({
            project: projectId,
            owner: req.user._id,
            title,
            description,
            requiredSkills,
            positions
        })

    return res.status(201).json(
        new ApiResponse(
            201,
            recruitment,
            "Recruitment created"
        )
    );

})

const getAllRecruitments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sort = "latest", skill, status, search } = req.query
    const filter = {}
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


    if (skill) {
        filter.requiredSkills = {
            $regex: skill,
            $options: "i"
        }
    }
    if (status) {
        if (!["OPEN", "CLOSED"].includes(status)) {
            throw new ApiError(
                400,
                "Invalid status"
            )
        }

        filter.status = status
    }
    if (search) {
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
                requiredSkills: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    const totalRecruitments = await Recruitment.countDocuments(filter)

    const recruitments = await Recruitment.aggregate([
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
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "project",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1
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
                            _id: 1,
                            username: 1
                        }

                    }
                ]
            }
        },
        {
            $addFields: {
                project: {
                    $first: "$project"
                },
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                project: 1,
                owner: 1,
                title: 1,
                positions: 1,
                description: 1,
                requiredSkills: 1,
                status: 1,
                createdAt: 1
            }
        }
    ])

    const totalPages = Math.ceil(totalRecruitments / limitNumber)

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                recruitments,
                page: pageNumber,
                limit: limitNumber,
                totalRecruitments,
                totalPages
            },
            "Recruitments fetched successfully"
        )
    )

})

const getRecruitmentById = asyncHandler(async (req, res) => {
    const { recruitmentId } = req.params
    if (!mongoose.Types.ObjectId.isValid(recruitmentId)) {
        throw new ApiError(400, "Invalid recruitment id");
    }

    const recruitment = await Recruitment.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(recruitmentId)
            }
        },
        {
            $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "project",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1
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
                            _id: 1,
                            username: 1,
                            avatar: 1
                        }

                    }
                ]
            }
        },
        {
            $addFields: {
                project: {
                    $first: "$project"
                },
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                project: 1,
                owner: 1,
                title: 1,
                positions: 1,
                description: 1,
                requiredSkills: 1,
                status: 1,
                createdAt: 1
            }
        }
    ])

    const [recruitmentData] = recruitment

    if (!recruitmentData) {
        throw new ApiError(404, "Recruitment not found");
    }

    return res.status(200).json(new ApiResponse(200, recruitmentData, "Recruitment fetched successfully from recruitment id"))


})

const updateRecruitment = asyncHandler(async (req, res) => {
    const { recruitmentId } = req.params;

    const {
        title,
        description,
        requiredSkills,
        positions,
        status
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(recruitmentId)) {
        throw new ApiError(
            400,
            "Invalid recruitment id"
        );
    }

    const recruitment = await Recruitment.findById(
        recruitmentId
    );

    if (!recruitment) {
        throw new ApiError(
            404,
            "Recruitment not found"
        );
    }

    if (recruitment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "Forbidden access to update recruitment"
        );
    }

    if (status && !["OPEN", "CLOSED"].includes(status)) {
        throw new ApiError(
            400,
            "Invalid recruitment status"
        );
    }

    if (title) {
        recruitment.title = title;
    }

    if (description) {
        recruitment.description = description;
    }

    if (requiredSkills) {
        recruitment.requiredSkills = requiredSkills;
    }

    if (positions) {
        recruitment.positions = positions;
    }

    if (status) {
        recruitment.status = status;
    }

    await recruitment.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            recruitment,
            "Recruitment updated successfully"
        )
    );
});

const deleteRecruitment = asyncHandler(async (req, res) => {
    const { recruitmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recruitmentId)) {
        throw new ApiError(
            400,
            "Invalid recruitment id"
        );
    }

    const recruitment = await Recruitment.findById(
        recruitmentId
    );

    if (!recruitment) {
        throw new ApiError(
            404,
            "Recruitment not found"
        );
    }

    if (
        recruitment.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "Forbidden access to delete recruitment"
        );
    }

    const acceptedApplications =
        await Application.countDocuments({
            recruitment: recruitmentId,
            status: "ACCEPTED"
        });

    if (acceptedApplications > 0) {
        throw new ApiError(
            400,
            "Cannot delete recruitment with accepted applicants"
        );
    }

    await Application.deleteMany({
        recruitment: recruitmentId
    });

    await recruitment.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Recruitment deleted successfully"
        )
    );
});

const applyToRecruitment = asyncHandler(async (req, res) => {
    const { recruitmentId } = req.params
    const { message } = req.body
    if (!mongoose.Types.ObjectId.isValid(recruitmentId)) {
        throw new ApiError(
            400,
            "Invalid recruitment id"
        )
    }

    if (!message?.trim()) {
        throw new ApiError(
            400,
            "Application message is required"
        )
    }

    const recruitment = await Recruitment.findById(recruitmentId)
    if (!recruitment) {
        throw new ApiError(
            404,
            "Recruitment not found"
        )
    }

    if (recruitment.status !== "OPEN") {
        throw new ApiError(
            400,
            "Recruitment is closed"
        )
    }

    if (recruitment.owner.toString() === req.user._id.toString()) {
        throw new ApiError(400,
            "Owner cannot apply"
        )
    }

    const alreadyApplied = await Application.findOne({
        recruitment: recruitmentId,
        applicant: req.user._id
    })

    if (alreadyApplied) {
        throw new ApiError(400, "Already applied")
    }

    const application = await Application.create({
        recruitment: recruitmentId,
        applicant: req.user._id,
        message
    }
    )

    return res.status(201).json(
        new ApiResponse(
            201,
            application,
            "Application submitted"
        )
    )

})

const getRecruitmentApplications = asyncHandler(async (req, res) => {
    const { recruitmentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(recruitmentId)) {
        throw new ApiError(400, "Invalid recruitment id");
    }

    const recruitment = await Recruitment.findById(recruitmentId)
    if (!recruitment) {
        throw new ApiError(404, "Recruitment not found")
    }

    if (recruitment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden access to handle recruitment")
    }

    const applications = await Application.aggregate([
        {
            $match: {
                recruitment: new mongoose.Types.ObjectId(recruitmentId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "applicant",
                foreignField: "_id",
                as: "applicant",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            skills: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "applicant",
                foreignField: "_id",
                as: "applicant",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            skills: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {

                applicant: 1,
                message: 1,
                status: 1,
                createdAt: 1

            }
        }
    ])

    return res.status(200).json(new ApiResponse((200, applications, "Applications fetched successfully")))

})


const acceptApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.params

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new ApiError(400, "Invalid application id");
    }

    const application = await Application.findById(applicationId)
    if (!application) {
        throw new ApiError(404, "Application not found")
    }

    const recruitment = await Recruitment.findById(application.recruitment)
    if (!recruitment) {
        throw new ApiError(
            404,
            "Recruitment not found"
        )
    }

    if (recruitment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden access to handle recruitment")
    }

    if (recruitment.status === "CLOSED") {
        throw new ApiError(
            400,
            "Recruitment is closed"
        )
    }

    if (application.status === "ACCEPTED") {
        throw new ApiError(400, "application already accepted")
    }
    if (application.status === "REJECTED") {
        throw new ApiError(400, "Cannot accept rejected application")
    }

    const acceptedApplications = await Application.countDocuments({
        recruitment: recruitment._id,
        status: "ACCEPTED"
    })

    if (acceptedApplications >= recruitment.positions) {
        throw new ApiError(
            400,
            "All positions have already been filled"
        )
    }

    await Application.findByIdAndUpdate(
        applicationId,
        {
            $set: {
                status: "ACCEPTED"
            }
        },
        {
            new: true
        }
    )

    if (acceptedApplications + 1 >= recruitment.positions) {
        recruitment.status = "CLOSED"
        await recruitment.save()
    }

    let team = await Team.findOne({
        project: recruitment.project
    })

    if (!team) {
        team = await Team.create({
            name: `${recruitment.title} Team`,
            project: recruitment.project,
            owner: recruitment.createdBy,
            members: [
                {
                    user: recruitment.createdBy,
                    role: "Lead"
                }
            ]
        })
    }

    const alreadyMember = team.members.some(
        member =>
            member.user.toString() ===
            application.applicant.toString()
    )

    if (!alreadyMember) {
        team.members.push({
            user: application.applicant,
            role: "Member"
        })
    }

    await team.save()

    return res.status(200).json(new ApiResponse(200,
        {
            status: "ACCEPTED",
        },
        "Application accepted successfully")
    )

})

const rejectApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new ApiError(
            400,
            "Invalid application id"
        );
    }

    const application = await Application.findById(
        applicationId
    );

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    const recruitment = await Recruitment.findById(
        application.recruitment
    );

    if (!recruitment) {
        throw new ApiError(
            404,
            "Recruitment not found"
        );
    }

    if (
        recruitment.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "Forbidden access to handle recruitment"
        );
    }

    if (application.status === "ACCEPTED") {
        throw new ApiError(
            400,
            "Cannot reject accepted application"
        );
    }

    if (application.status === "REJECTED") {
        throw new ApiError(
            400,
            "Application already rejected"
        );
    }

    application.status = "REJECTED";

    await application.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                status: "REJECTED"
            },
            "Application rejected successfully"
        )
    );
});

export {
    createRecruitment, getAllRecruitments, getRecruitmentById, updateRecruitment,
    deleteRecruitment, applyToRecruitment, getRecruitmentApplications, acceptApplication, rejectApplication
}

