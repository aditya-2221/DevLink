import mongoose from "mongoose";

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import conversationService from "../services/conversation.service.js";
import permissionService from "../services/permission.service.js";

const getMyConversations = asyncHandler(async (req, res) => {


    const conversations =
        await conversationService.getUserConversations(
            req.user._id
        );

    console.log(
        conversations.map(c => ({
            id: c._id,
            type: c.type,
            name: c.name,
            team: c.team
        }))
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversations,
            "Conversations fetched successfully"
        )
    );

});

const getConversationById = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    const conversation =
        await permissionService.getAuthorizedConversation(
            conversationId,
            req.user._id
        );

    if (!conversation) {
        throw new ApiError(
            404,
            "Conversation not found"
        );
    }

    const data =
        await conversationService.getConversationById(
            conversationId
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            data,
            "Conversation fetched successfully"
        )
    );

});

const createGroupConversation = asyncHandler(async (req, res) => {

    const {
        name,
        participants,
        admins = [],
        team
    } = req.body;

    if (!name?.trim()) {
        throw new ApiError(
            400,
            "Group name is required"
        );
    }

    if (!Array.isArray(participants) || participants.length === 0) {
        throw new ApiError(
            400,
            "Participants are required"
        );
    }

    const conversation =
        await conversationService.createGroupConversation({
            name,
            image: req.file?.path || "",
            participants,
            admins,
            team,
            createdBy: req.user._id
        });

    return res.status(201).json(
        new ApiResponse(
            201,
            conversation,
            "Group conversation created successfully"
        )
    );

});

const addParticipants = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;
    const { participants } = req.body;

    const isAdmin =
        await permissionService.isConversationAdmin(
            conversationId,
            req.user._id
        );

    if (!isAdmin) {
        throw new ApiError(
            403,
            "Only admins can add participants"
        );
    }

    const conversation =
        await conversationService.addParticipants(
            conversationId,
            participants
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversation,
            "Participants added successfully"
        )
    );

});

const removeParticipant = asyncHandler(async (req, res) => {

    const { conversationId, userId } = req.params;

    const isAdmin =
        await permissionService.isConversationAdmin(
            conversationId,
            req.user._id
        );

    if (!isAdmin) {
        throw new ApiError(
            403,
            "Only admins can remove participants"
        );
    }

    const conversation =
        await conversationService.removeParticipant(
            conversationId,
            userId
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversation,
            "Participant removed successfully"
        )
    );

});

const updateGroupConversation = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    const isAdmin =
        await permissionService.isConversationAdmin(
            conversationId,
            req.user._id
        );

    if (!isAdmin) {
        throw new ApiError(
            403,
            "Only admins can update group"
        );
    }

    const conversation =
        await conversationService.updateGroup(
            conversationId,
            {
                ...req.body,
                image: req.file?.path || req.body.image,
                updatedBy: req.user._id
            }
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversation,
            "Group updated successfully"
        )
    );

});

const archiveConversation = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    const conversation =
        await conversationService.archiveConversation(
            conversationId,
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversation,
            "Conversation archived successfully"
        )
    );

});

const unarchiveConversation = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    const conversation =
        await conversationService.unarchiveConversation(
            conversationId,
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversation,
            "Conversation unarchived successfully"
        )
    );

});

const muteConversation = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    const conversation =
        await conversationService.muteConversation(
            conversationId,
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversation,
            "Conversation muted successfully"
        )
    );

});

const unmuteConversation = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    const conversation =
        await conversationService.unmuteConversation(
            conversationId,
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversation,
            "Conversation unmuted successfully"
        )
    );

});

export {
    getMyConversations,
    getConversationById,
    createGroupConversation,
    addParticipants,
    removeParticipant,
    updateGroupConversation,
    archiveConversation,
    unarchiveConversation,
    muteConversation,
    unmuteConversation
};