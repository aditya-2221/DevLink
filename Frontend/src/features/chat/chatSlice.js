import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversations: [],
    teamChats: [],
    directChats: [],

    currentConversation: null,

    messages: [],

    pendingRequests: [],
    sentRequests: [],

    onlineUsers: [],
    typingUsers: [],

    unreadCounts: {},

    loading: false,
    messageLoading: false,
    requestLoading: false,
    replyMessage: null,

    error: null
};

const chatSlice = createSlice({
    name: "chat",

    initialState,

    reducers: {

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setMessageLoading: (state, action) => {
            state.messageLoading = action.payload;
        },

        setRequestLoading: (state, action) => {
            state.requestLoading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },

        setConversations: (state, action) => {

            state.conversations = action.payload;

            state.teamChats = action.payload.filter(
                (conversation) =>
                    conversation.type === "group"
            );

            state.directChats = action.payload.filter(
                (conversation) =>
                    conversation.type === "direct"
            );

        },

        addConversation: (state, action) => {

            state.conversations.unshift(action.payload);

            if (action.payload.type === "group") {

                state.teamChats.unshift(action.payload);

            } else {

                state.directChats.unshift(action.payload);

            }

        },

        updateConversation: (state, action) => {

            const updated = action.payload;

            state.conversations =
                state.conversations.map(
                    (conversation) =>
                        conversation._id === updated._id
                            ? updated
                            : conversation
                );

            state.teamChats =
                state.teamChats.map(
                    (conversation) =>
                        conversation._id === updated._id
                            ? updated
                            : conversation
                );

            state.directChats =
                state.directChats.map(
                    (conversation) =>
                        conversation._id === updated._id
                            ? updated
                            : conversation
                );

            if (
                state.currentConversation?._id ===
                updated._id
            ) {

                state.currentConversation = updated;

            }

        },
        reorderConversation: (state, action) => {

            const updated = action.payload;

            state.conversations = [
                updated,
                ...state.conversations.filter(
                    conversation =>
                        conversation._id !== updated._id
                )
            ];

            if (updated.type === "group") {

                state.teamChats = [
                    updated,
                    ...state.teamChats.filter(
                        conversation =>
                            conversation._id !== updated._id
                    )
                ];

            } else {

                state.directChats = [
                    updated,
                    ...state.directChats.filter(
                        conversation =>
                            conversation._id !== updated._id
                    )
                ];

            }

            if (
                state.currentConversation?._id ===
                updated._id
            ) {

                state.currentConversation = updated;

            }

        },
        setReplyMessage: (state, action) => {

            state.replyMessage = action.payload;

        },

        clearReplyMessage: (state) => {

            state.replyMessage = null;

        },

        setCurrentConversation: (
            state,
            action
        ) => {

            state.currentConversation =
                action.payload;

        },

        clearCurrentConversation: (
            state
        ) => {

            state.currentConversation = null;

            state.messages = [];

            state.typingUsers = [];

        },

        setMessages: (
            state,
            action
        ) => {

            state.messages = action.payload;

        },

        prependMessages: (
            state,
            action
        ) => {

            state.messages = [
                ...action.payload,
                ...state.messages
            ];

        },

        addMessage: (
            state,
            action
        ) => {

            const exists =
                state.messages.some(
                    (message) =>
                        message._id ===
                        action.payload._id
                );

            if (!exists) {

                state.messages.push(
                    action.payload
                );

            }

        },

        updateMessage: (
            state,
            action
        ) => {

            state.messages =
                state.messages.map(
                    (message) =>
                        message._id ===
                            action.payload._id
                            ? action.payload
                            : message
                );

        },

        removeMessage: (
            state,
            action
        ) => {

            state.messages =
                state.messages.filter(
                    (message) =>
                        message._id !==
                        action.payload
                );

        },

        messageRead(state, action) {

            const {
                updatedMessages
            } = action.payload;

            updatedMessages.forEach(updated => {

                const index =
                    state.messages.findIndex(
                        m => m._id === updated._id
                    );

                if (index !== -1) {

                    state.messages[index] =
                        updated;

                }

            });

        },

        setPendingRequests: (
            state,
            action
        ) => {

            state.pendingRequests =
                action.payload;

        },

        setSentRequests: (
            state,
            action
        ) => {

            state.sentRequests =
                action.payload;

        },

        setOnlineUsers: (
            state,
            action
        ) => {

            state.onlineUsers =
                action.payload;

        },

        userOnline: (
            state,
            action
        ) => {

            if (
                !state.onlineUsers.includes(
                    action.payload
                )
            ) {

                state.onlineUsers.push(
                    action.payload
                );

            }

        },

        userOffline: (
            state,
            action
        ) => {

            state.onlineUsers =
                state.onlineUsers.filter(
                    (id) =>
                        id !== action.payload
                );

        },

        setTypingUsers: (
            state,
            action
        ) => {

            state.typingUsers =
                action.payload;

        },
        typingStarted: (state, action) => {

            const exists = state.typingUsers.some(
                user => user._id === action.payload._id
            );

            if (!exists) {

                state.typingUsers.push(action.payload);

            }

        },

        typingStopped: (state, action) => {

            state.typingUsers =
                state.typingUsers.filter(
                    user =>
                        user._id !== action.payload
                );

        },

        setUnreadCount: (
            state,
            action
        ) => {

            const {
                conversationId,
                count
            } = action.payload;

            state.unreadCounts[
                conversationId
            ] = count;

        },

        clearUnreadCount: (
            state,
            action
        ) => {

            state.unreadCounts[
                action.payload
            ] = 0;

        }

    }

});

export const {

    setLoading,
    setMessageLoading,
    setRequestLoading,

    setError,
    clearError,

    setConversations,
    addConversation,
    updateConversation,
    reorderConversation,

    setCurrentConversation,
    clearCurrentConversation,

    setMessages,
    prependMessages,
    addMessage,
    updateMessage,
    removeMessage,
    messageRead,

    setPendingRequests,
    setSentRequests,

    setOnlineUsers,
    userOnline,
    userOffline,

    setTypingUsers,

    setUnreadCount,
    clearUnreadCount,

    setReplyMessage,
    clearReplyMessage,

    typingStarted,
    typingStopped,

} = chatSlice.actions;

export default chatSlice.reducer;