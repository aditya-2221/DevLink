import { Router } from "express";


import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
    sendChatRequest,
    getPendingRequests,
    getSentRequests,
    acceptChatRequest,
    rejectChatRequest,
    blockChatRequest,
    deleteChatRequest,
    getConversationStatus
} from "../controllers/chatRequest.controller.js";

import {
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
} from "../controllers/conversation.controller.js";

import {
    sendMessage,
    getMessages,
    editMessage,
    deleteMessage,
    markConversationAsRead,
    searchMessages
} from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/requests")
    .post(sendChatRequest)
    .get(getPendingRequests);

router.get(
    "/requests/sent",
    getSentRequests
);

router.patch(
    "/requests/:requestId/accept",
    acceptChatRequest
);

router.patch(
    "/requests/:requestId/reject",
    rejectChatRequest
);

router.patch(
    "/requests/:requestId/block",
    blockChatRequest
);

router.delete(
    "/requests/:requestId",
    deleteChatRequest
);

router.get(

    "/status/:userId",

    getConversationStatus

);

router.route("/conversations")
    .get(getMyConversations);

router.post(
    "/conversations/group",
    upload.single("image"),
    createGroupConversation
);

router.get(
    "/conversations/:conversationId",
    getConversationById
);

router.patch(
    "/conversations/:conversationId",
    upload.single("image"),
    updateGroupConversation
);

router.patch(
    "/conversations/:conversationId/archive",
    archiveConversation
);

router.patch(
    "/conversations/:conversationId/unarchive",
    unarchiveConversation
);

router.patch(
    "/conversations/:conversationId/mute",
    muteConversation
);

router.patch(
    "/conversations/:conversationId/unmute",
    unmuteConversation
);

router.post(
    "/conversations/:conversationId/participants",
    addParticipants
);

router.delete(
    "/conversations/:conversationId/participants/:userId",
    removeParticipant
);

router.route("/conversations/:conversationId/messages")
    .post(
        upload.array("attachments", 10),
        sendMessage
    )
    .get(getMessages);

router.patch(
    "/messages/:messageId",
    editMessage
);

router.delete(
    "/messages/:messageId",
    deleteMessage
);

router.patch(
    "/conversations/:conversationId/read",
    markConversationAsRead
);

router.get(
    "/conversations/:conversationId/search",
    searchMessages
);

export default router;