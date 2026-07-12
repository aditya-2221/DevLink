import api from "../api/axios";

const sendChatRequest = async (data) => {
    const response = await api.post("/chat/requests", data);
    return response.data.data;
};

const getPendingRequests = async () => {
    const response = await api.get("/chat/requests");
    return response.data.data;
};

const getSentRequests = async () => {
    const response = await api.get("/chat/requests/sent");
    return response.data.data;
};

const acceptChatRequest = async (requestId) => {
    const response = await api.patch(
        `/chat/requests/${requestId}/accept`
    );
    return response.data.data;
};

const rejectChatRequest = async (requestId) => {
    const response = await api.patch(
        `/chat/requests/${requestId}/reject`
    );
    return response.data.data;
};

const deleteChatRequest = async (requestId) => {
    const response = await api.delete(
        `/chat/requests/${requestId}`
    );
    return response.data.data;
};

const getConversations = async () => {
    const response = await api.get("/chat/conversations");
    return response.data.data;
};

const getConversation = async (conversationId) => {
    const response = await api.get(
        `/chat/conversations/${conversationId}`
    );
    return response.data.data;
};

const createGroupConversation = async (formData) => {
    const response = await api.post(
        "/chat/conversations/group",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data.data;
};

const archiveConversation = async (conversationId) => {
    const response = await api.patch(
        `/chat/conversations/${conversationId}/archive`
    );

    return response.data.data;
};

const unarchiveConversation = async (conversationId) => {
    const response = await api.patch(
        `/chat/conversations/${conversationId}/unarchive`
    );

    return response.data.data;
};

const muteConversation = async (conversationId) => {
    const response = await api.patch(
        `/chat/conversations/${conversationId}/mute`
    );

    return response.data.data;
};

const unmuteConversation = async (conversationId) => {
    const response = await api.patch(
        `/chat/conversations/${conversationId}/unmute`
    );

    return response.data.data;
};

const getMessages = async (
    conversationId,
    page = 1
) => {

    const response = await api.get(
        `/chat/conversations/${conversationId}/messages?page=${page}`
    );

    return response.data.data;

};

const sendMessage = async (
    conversationId,
    formData
) => {

    const response = await api.post(
        `/chat/conversations/${conversationId}/messages`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data.data;

};

const editMessage = async (
    messageId,
    content
) => {

    const response = await api.patch(
        `/chat/messages/${messageId}`,
        {
            content
        }
    );

    return response.data.data;

};

const deleteMessage = async (
    messageId
) => {

    const response = await api.delete(
        `/chat/messages/${messageId}`
    );

    return response.data.data;

};

const markConversationAsRead = async (
    conversationId,
    lastMessageId
) => {

    const response = await api.patch(
        `/chat/conversations/${conversationId}/read`,
        {
            lastMessageId
        }
    );

    return response.data.data;

};

const searchMessages = async (
    conversationId,
    query
) => {

    const response = await api.get(
        `/chat/conversations/${conversationId}/search?q=${query}`
    );

    return response.data.data;

};

const getConversationStatus = async (
    userId
) => {

    const response =
        await api.get(
            `/chat/status/${userId}`
        );

    return response.data.data;

};

const chatService = {
    sendChatRequest,
    getPendingRequests,
    getSentRequests,
    acceptChatRequest,
    rejectChatRequest,
    deleteChatRequest,
    getConversations,
    getConversation,
    createGroupConversation,
    archiveConversation,
    unarchiveConversation,
    muteConversation,
    unmuteConversation,
    getMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    markConversationAsRead,
    searchMessages,
    getConversationStatus
};

export default chatService;