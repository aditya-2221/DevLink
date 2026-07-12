import mongoose from "mongoose";

import permissionService from "../services/permission.service.js";

const registerSocketEvents = (
    io,
    socket,
    onlineUsers
) => {

    socket.on(
        "joinConversation",
        async (conversationId) => {

            if (
                !mongoose.Types.ObjectId.isValid(
                    conversationId
                )
            ) {
                return;
            }

            const isMember =
                await permissionService.isConversationMember(
                    conversationId,
                    socket.user._id
                );

            if (!isMember) {
                return;
            }

            socket.join(conversationId);

        }
    );

    socket.on(
        "leaveConversation",
        (conversationId) => {

            socket.leave(conversationId);

        }
    );

    socket.on(
        "markConversationRead",
        async ({
            conversationId,
            lastMessageId
        }) => {

            const isMember =
                await permissionService.isConversationMember(
                    conversationId,
                    socket.user._id
                );

            if (!isMember) {
                return;
            }

            socket.to(conversationId).emit(
                "conversationRead",
                {
                    conversationId,
                    userId: socket.user._id,
                    lastMessageId
                }
            );

        }
    );

    socket.on(
        "typing:start",
        async (conversationId) => {

            const isMember =
                await permissionService.isConversationMember(
                    conversationId,
                    socket.user._id
                );

            if (!isMember) {
                return;
            }

            socket.to(conversationId).emit(
                "typing:start",
                {
                    conversationId,
                    user: {
                        _id: socket.user._id,
                        fullName: socket.user.fullName,
                        avatar: socket.user.avatar
                    }
                }
            );

        }
    );

    socket.on(
        "typing:stop",
        async (conversationId) => {

            const isMember =
                await permissionService.isConversationMember(
                    conversationId,
                    socket.user._id
                );

            if (!isMember) {
                return;
            }

            socket.to(conversationId).emit(
                "typing:stop",
                {
                    conversationId,
                    userId: socket.user._id
                }
            );

        }
    );

    socket.on(
        "disconnect",
        () => {

            onlineUsers.delete(
                socket.user._id.toString()
            );

            io.emit(
                "onlineUsers",
                [...onlineUsers.keys()]
            );

        }
    );

};

export default registerSocketEvents;