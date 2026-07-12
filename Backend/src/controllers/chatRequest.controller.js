import mongoose from "mongoose";


import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import chatRequestService from "../services/chatRequest.service.js";
import conversationService from "../services/conversation.service.js";
import { getIO } from "../socket/socket.service.js";
import { createNotification } from "./notification.controller.js";

const sendChatRequest = asyncHandler(async (req, res) => {

    const { receiverId, message = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        throw new ApiError(400, "Invalid receiver");
    }

    if (receiverId === req.user._id.toString()) {
        throw new ApiError(400, "You cannot send request to yourself");
    }

    const canMessage = await chatRequestService.canMessage(
        req.user._id,
        receiverId
    );

    if (canMessage) {

        const existingConversation =
            await conversationService.findDirectConversation(
                req.user._id,
                receiverId
            );

        if (existingConversation) {

            return res.status(200).json(

                new ApiResponse(

                    200,

                    existingConversation,

                    "Conversation already exists"

                )

            );

        }

        const conversation =
            await conversationService.createDirectConversation(

                req.user._id,

                receiverId

            );

        return res.status(201).json(

            new ApiResponse(

                201,

                conversation,

                "Conversation created"

            )

        );

    }

    const request = await chatRequestService.createRequest({
        sender: req.user._id,
        receiver: receiverId,
        message
    });

    await createNotification({

        recipient: receiverId,

        sender: req.user._id,

        type: "CHAT_REQUEST",

        message: `${req.user.fullName} sent you a chat request.`,

        referenceId: request._id

    });

    const io = getIO();

    io.to(receiverId.toString()).emit(
        "chat:request:new",
        request
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            request,
            "Chat request sent successfully"
        )
    );

});


const getPendingRequests = asyncHandler(async (req, res) => {

    const requests =
        await chatRequestService.getPendingRequests(
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            requests,
            "Pending requests fetched successfully"
        )
    );

});

const getSentRequests = asyncHandler(async (req, res) => {

    const requests =
        await chatRequestService.getSentRequests(
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            requests,
            "Sent requests fetched successfully"
        )
    );

});

const getConversationStatus = asyncHandler(async (req, res) => {

    const status =
        await conversationService.getConversationStatus(

            req.user._id,

            req.params.userId

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            status,

            "Status fetched"

        )

    );

});

const acceptChatRequest = asyncHandler(async (req, res) => {

    const { requestId } = req.params;

    const request =
        await chatRequestService.getRequestById(
            requestId
        );

    if (!request) {
        throw new ApiError(404, "Request not found");
    }

    if (
        request.receiver._id.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(403, "Unauthorized");
    }

    let conversation = request.conversation;

    if (!conversation) {

        conversation =
            await conversationService.createDirectConversation(
                request.sender._id,
                request.receiver._id
            );

    }

    const updatedRequest = await chatRequestService.acceptRequest(
        requestId,
        conversation._id
    );
    await createNotification({

        recipient: request.sender._id,

        sender: req.user._id,

        type: "CHAT_REQUEST_ACCEPTED",

        message: `${req.user.fullName} accepted your chat request.`,

        referenceId: conversation._id

    });
    const io = getIO();

    io.to(request.sender._id.toString()).emit(
        "chat:request:accepted",
        {
            request: updatedRequest,
            conversation
        }
    );

    io.to(request.receiver._id.toString()).emit(
        "conversation:new",
        conversation
    );
    return res.status(200).json(
        new ApiResponse(
            200,
            updatedRequest,
            "Chat request accepted successfully"
        )
    );

});

const rejectChatRequest = asyncHandler(async (req, res) => {

    const { requestId } = req.params;

    const request =
        await chatRequestService.getRequestById(
            requestId
        );

    if (!request) {
        throw new ApiError(404, "Request not found");
    }

    if (
        request.receiver._id.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(403, "Unauthorized");
    }

    const updatedRequest = await chatRequestService.rejectRequest(
        requestId
    );

    await createNotification({

        recipient: request.sender._id,

        sender: req.user._id,

        type: "CHAT_REQUEST_REJECTED",

        message: `${req.user.fullName} rejected your chat request.`,

        referenceId: request._id

    });

    const io = getIO();

    io.to(request.sender._id.toString()).emit(
        "chat:request:rejected",
        updatedRequest
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedRequest,
            "Chat request rejected successfully"
        )
    );

});

const blockChatRequest = asyncHandler(async (req, res) => {

    const { requestId } = req.params;

    const request =
        await chatRequestService.getRequestById(
            requestId
        );

    if (!request) {
        throw new ApiError(404, "Request not found");
    }

    if (
        request.receiver._id.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(403, "Unauthorized");
    }

    const updatedRequest =
        await chatRequestService.blockRequest(
            requestId
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedRequest,
            "User blocked successfully"
        )
    );

});

const deleteChatRequest = asyncHandler(async (req, res) => {

    const { requestId } = req.params;

    const request = await chatRequestService.getRequestById(
        requestId
    );

    if (!request) {
        throw new ApiError(404, "Request not found");
    }

    if (
        request.sender._id.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(403, "Unauthorized");
    }

    await chatRequestService.deleteRequest(
        requestId
    );
    const io = getIO();

    io.to(request.receiver._id.toString()).emit(
        "chat:request:deleted",
        {
            requestId
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Request deleted successfully"
        )
    );

});

export {
    sendChatRequest,
    getPendingRequests,
    getSentRequests,
    acceptChatRequest,
    rejectChatRequest,
    blockChatRequest,
    deleteChatRequest,
    getConversationStatus
};