import mongoose from "mongoose";

import { Project } from "../models/project.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
    buildDescriptionPrompt,
    buildReadmePrompt,
    buildReportPrompt,
    buildReviewPrompt
} from "../utils/promptBuilder.js";

import {
    generateAIResponse
} from "../services/ai.service.js";

const getProject = async (projectId) => {

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project id");
    }

    const project = await Project.findById(projectId).populate("owner", "fullName username");

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return project;

};

const generateDescription = asyncHandler(async (req, res) => {

    const { projectId } = req.body;

    const project = await getProject(projectId);

    const prompt = buildDescriptionPrompt(project);

    const result = await generateAIResponse(prompt);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Description generated successfully"
        )
    );

});

const generateReadme = asyncHandler(async (req, res) => {

    const { projectId } = req.body;

    const project = await getProject(projectId);

    const prompt = buildReadmePrompt(project);

    const result = await generateAIResponse(prompt);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "README generated successfully"
        )
    );

});

const generateReport = asyncHandler(async (req, res) => {

    const { projectId } = req.body;

    const project = await getProject(projectId);

    const prompt = buildReportPrompt(project);

    const result = await generateAIResponse(prompt);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Report generated successfully"
        )
    );

});

const reviewProject = asyncHandler(async (req, res) => {

    const { projectId } = req.body;

    const project = await getProject(projectId);

    const prompt = buildReviewPrompt(project);

    const result = await generateAIResponse(prompt);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Review generated successfully"
        )
    );

});

export {
    generateDescription,
    generateReadme,
    generateReport,
    reviewProject
};