import mongoose from "mongoose";
import { getIO } from "../socket/socket.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import messageService from "../services/message.service.js";
import conversationService from "../services/conversation.service.js";
import permissionService from "../services/permission.service.js";

const sendMessage = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;
    const {
        content = "",
        type = "TEXT",
        replyTo = null
    } = req.body;

    const conversation =
        await permissionService.getAuthorizedConversation(
            conversationId,
            req.user._id
        );

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const attachments = req.uploadedFiles || [];

    if (
        !content.trim() &&
        attachments.length === 0
    ) {
        throw new ApiError(
            400,
            "Message cannot be empty"
        );
    }

    const message =
        await messageService.createMessage({
            conversationId,
            sender: req.user._id,
            content,
            type,
            attachments,
            replyTo
        });

    const updatedConversation =
        await conversationService.getConversationById(
            conversationId
        );

    const io = getIO();

    io.to(conversationId).emit(
        "newMessage",
        message
    );

    io.to(conversationId).emit(
        "conversationUpdated",
        updatedConversation
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            message,
            "Message sent successfully"
        )
    );

});

const getMessages = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;

    const conversation =
        await permissionService.getAuthorizedConversation(
            conversationId,
            req.user._id
        );

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const messages =
        await messageService.getConversationMessages(
            conversationId,
            page,
            limit
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            messages,
            "Messages fetched successfully"
        )
    );

});

const editMessage = asyncHandler(async (req, res) => {

    const { messageId } = req.params;
    const { content } = req.body;

    const message =await messageService.getMessageById(
            messageId
        );
    

    if (!message) {
        throw new ApiError(404, "Message not found");
    }

    if (
        !permissionService.isMessageOwner(
            message,
            req.user._id
        )
    ) {
        throw new ApiError(
            403,
            "Unauthorized"
        );
    }

    const updatedMessage = await messageService.editMessage(
            messageId,
            content
        );

    const io = getIO();

    io.to(
        updatedMessage.conversation.toString()
    ).emit(
        "messageUpdated",
        updatedMessage
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedMessage,
            "Message updated successfully"
        )
    );

});

const deleteMessage = asyncHandler(async (req, res) => {

    const { messageId } = req.params;

    const message =
        await messageService.getMessageById(
            messageId
        );

    if (!message) {
        throw new ApiError(404, "Message not found");
    }

    if (
        !permissionService.isMessageOwner(
            message,
            req.user._id
        )
    ) {
        throw new ApiError(
            403,
            "Unauthorized"
        );
    }

    const deletedMessage =
        await messageService.deleteMessage(
            messageId
        );

    const io = getIO();

    io.to(
        deletedMessage.conversation.toString()
    ).emit(
        "messageDeleted",
        deletedMessage
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedMessage,
            "Message deleted successfully"
        )
    );

});

const markConversationAsRead = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;
    const { lastMessageId } = req.body;

    const conversation =
        await permissionService.getAuthorizedConversation(
            conversationId,
            req.user._id
        );

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const updatedMessages = await messageService.markConversationAsRead(
        conversationId,
        req.user._id,
        lastMessageId
    );
    const io = getIO();

    io.to(conversationId).emit(
        "conversationRead",
        {
            conversationId,
            userId: req.user._id,
            lastMessageId,
            updatedMessages
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Conversation marked as read"
        )
    );

});

const searchMessages = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;
    const { q } = req.query;

    const conversation =
        await permissionService.getAuthorizedConversation(
            conversationId,
            req.user._id
        );

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const messages =
        await messageService.searchMessages(
            conversationId,
            q
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            messages,
            "Messages fetched successfully"
        )
    );

});

export {
    sendMessage,
    getMessages,
    editMessage,
    deleteMessage,
    markConversationAsRead,
    searchMessages
};