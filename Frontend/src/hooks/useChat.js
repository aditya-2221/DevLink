import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../app/store";
import chatService from "../services/chatService";

import {
    setLoading,
    setMessageLoading,
    setRequestLoading,
    setError,

    setConversations,
    setCurrentConversation,

    setMessages,
    prependMessages,
    addMessage,
    updateMessage,
    messageRead,
    reorderConversation,

    setPendingRequests,
    setSentRequests,

    setOnlineUsers,
    typingStarted,
    typingStopped,

    setUnreadCount,

    clearCurrentConversation
} from "../features/chat/chatSlice";

import {
    connectSocket,
    disconnectSocket,

    joinConversation,
    leaveConversation,

    markConversationRead,

    startTyping,
    stopTyping,

    onConnect,
    onDisconnect,

    onNewMessage,
    onConversationUpdated,
    onConversationRead,

    onTypingStart,
    onTypingStop,

    onOnlineUsers,

    onMessageUpdated,
    onMessageDeleted,

    removeListener
} from "../socket/socket";

const useChat = () => {

    const dispatch = useDispatch();

    const {
        currentConversation,
        messages,
    } = useSelector(
        state => state.chat
    );

    const [page, setPage] = useState(1);

    const initializeChat = async () => {

        try {

            dispatch(
                setLoading(true)
            );

            if (!connectSocket().connected) {

                connectSocket();

            }
            const conversations =
                await chatService.getConversations();

            dispatch(
                setConversations(
                    conversations
                )
            );

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    error.message
                )
            );

        } finally {

            dispatch(
                setLoading(false)
            );

        }

    };

    const loadConversation = async (
        conversation
    ) => {

        try {

            if (
                currentConversation?._id
            ) {



            }

            dispatch(
                setCurrentConversation(
                    conversation
                )
            );

            dispatch(
                setMessageLoading(true)
            );

            setPage(1);

            const data =
                await chatService.getMessages(
                    conversation._id,
                    1
                );

            dispatch(
                setMessages(
                    data.messages
                )
            );

            dispatch(
                setUnreadCount({

                    conversationId:
                        conversation._id,

                    count: 0

                })
            );



        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    error.message
                )
            );

        } finally {

            dispatch(
                setMessageLoading(false)
            );

        }

    };

    const loadMoreMessages = async () => {

        if (!currentConversation) {
            return;
        }

        try {

            const nextPage =
                page + 1;

            const data =
                await chatService.getMessages(
                    currentConversation._id,
                    nextPage
                );

            if (
                data.messages.length
            ) {

                dispatch(
                    prependMessages(
                        data.messages
                    )
                );

                setPage(
                    nextPage
                );

            }

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    error.message
                )
            );

        }

    };

    const sendMessage = async (
        formData
    ) => {

        if (!currentConversation) {
            return;
        }

        try {

            const message =
                await chatService.sendMessage(
                    currentConversation._id,
                    formData
                );

            dispatch(
                addMessage(
                    message
                )
            );

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    error.message
                )
            );

        }

    };

    const editMessage = async (
        messageId,
        content
    ) => {

        try {

            const updated =
                await chatService.editMessage(
                    messageId,
                    content
                );

            dispatch(
                updateMessage(
                    updated
                )
            );

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    error.message
                )
            );

        }

    };

    const deleteMessage = async (
        messageId
    ) => {

        try {

            const deleted =
                await chatService.deleteMessage(
                    messageId
                );

            dispatch(
                updateMessage(
                    deleted
                )
            );

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    error.message
                )
            );

        }

    };

    const loadPendingRequests = async () => {

        try {

            dispatch(
                setRequestLoading(true)
            );

            const requests =
                await chatService.getPendingRequests();

            dispatch(
                setPendingRequests(
                    requests
                )
            );

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    error.message
                )
            );

        } finally {

            dispatch(
                setRequestLoading(false)
            );

        }

    };

    const loadSentRequests = async () => {

        try {

            const requests =
                await chatService.getSentRequests();

            dispatch(
                setSentRequests(
                    requests
                )
            );

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    error.message
                )
            );

        }

    };

    const acceptRequest = async (
        requestId
    ) => {

        await chatService.acceptChatRequest(
            requestId
        );

        await initializeChat();

        await loadPendingRequests();

    };

    const rejectRequest = async (
        requestId
    ) => {

        await chatService.rejectChatRequest(
            requestId
        );

        await loadPendingRequests();

    };

    const cancelRequest = async (
        requestId
    ) => {

        await chatService.cancelChatRequest(
            requestId
        );

        await loadSentRequests();

    };
    const handleMessageAction = async (
        userId,
        navigate
    ) => {

        const status =
            await chatService.getConversationStatus(
                userId
            );

        switch (status.status) {

            case "conversation":

                navigate("/chats", {

                    state: {

                        conversationId:
                            status.conversationId

                    }

                });

                break;

            case "none":

                await chatService.sendChatRequest({

                    receiverId: userId

                });

                break;

            case "pending":

                if (
                    status.direction ===
                    "received"
                ) {

                    await chatService.acceptChatRequest(

                        status.requestId

                    );

                }

                break;

            default:
                break;

        }

        return status;

    };

    useEffect(() => {
        connectSocket()

        onConnect(() => {

            console.log(
                "Socket Connected"
            );

        });

        onDisconnect(() => {

            console.log(
                "Socket Disconnected"
            );

        });

        onNewMessage((message) => {

            const activeConversation = store.getState().chat.currentConversation;

            const activeConversationId = activeConversation?._id;

            const conversationId = typeof message.conversation === "object" ? message.conversation._id : message.conversation;

            const isCurrentConversation = activeConversationId === conversationId;

            if (isCurrentConversation) {

                dispatch(
                    addMessage(message)
                );

                markConversationRead(
                    conversationId,
                    message._id
                );
            } else {

                dispatch(
                    setUnreadCount({

                        conversationId:
                            message.conversation,

                        count:
                            (
                                (
                                    store.getState().chat.unreadCounts[
                                    message.conversation
                                    ] || 0
                                ) + 1
                            )

                    })
                );

            }

        });

        onConversationUpdated(
            conversation => {

                dispatch(
                    reorderConversation(
                        conversation
                    )
                );

            }
        );
        onConversationRead((payload) => {

            dispatch(messageRead(payload));

        });

        onOnlineUsers(
            users => {

                dispatch(
                    setOnlineUsers(
                        users
                    )
                );

            }
        );

        onTypingStart(({ user }) => {

            const currentUser =
                store.getState().auth.user;

            if (
                currentUser?._id === user._id
            ) {
                return;
            }

            dispatch(
                typingStarted(user)
            );

        });

        onTypingStop(
            ({ userId }) => {

                dispatch(
                    typingStopped(userId)
                );

            }
        );
        onMessageUpdated(
            message => {

                dispatch(
                    updateMessage(
                        message
                    )
                );

            }
        );

        onMessageDeleted(
            message => {

                dispatch(
                    updateMessage(
                        message
                    )
                );

            }
        );

        return () => {

            removeListener(
                "connect"
            );

            removeListener(
                "disconnect"
            );

            removeListener(
                "newMessage"
            );

            removeListener(
                "conversationUpdated"
            );


            removeListener(
                "conversationRead"
            );

            removeListener(
                "typing:start"
            );

            removeListener(
                "typing:stop"
            );

            removeListener(
                "onlineUsers"
            );

            removeListener(
                "messageUpdated"
            );

            removeListener(
                "messageDeleted"
            );



        };

    }, []);
    useEffect(() => {

        if (!currentConversation?._id) return;

        joinConversation(currentConversation._id);

        markConversationRead(
            currentConversation._id,
            null
        );

        return () => {

            leaveConversation(currentConversation._id);

        };

    }, [currentConversation?._id]);

    return {

        initializeChat,

        loadConversation,

        loadMoreMessages,

        sendMessage,

        editMessage,

        deleteMessage,

        loadPendingRequests,

        loadSentRequests,

        acceptRequest,

        rejectRequest,

        cancelRequest,

        startTyping,

        stopTyping,
        handleMessageAction,

        messages,

        currentConversation,

        clearConversation: () =>
            dispatch(
                clearCurrentConversation()
            )

    };

};

export default useChat;