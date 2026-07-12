import mongoose from "mongoose";

import { Conversation } from "../models/conversation.model.js";
import { ChatRequest } from "../models/chatRequest.model.js";

class ConversationService {

    async findDirectConversation(userId, otherUserId) {

        return await Conversation.findOne({
            type: "direct",
            isDeleted: false,
            participants: {

                $all: [

                    {

                        $elemMatch: {

                            user: userId

                        }

                    },

                    {

                        $elemMatch: {

                            user: otherUserId

                        }

                    }

                ]

            },

            $expr: {

                $eq: [

                    {

                        $size: "$participants"

                    },

                    2

                ]

            }
        });

    }
    async getConversationStatus(userId, otherUserId) {

        const conversation =
            await this.findDirectConversation(
                userId,
                otherUserId
            );

        if (conversation) {

            return {

                status: "conversation",

                conversation

            };

        }

        const request = await ChatRequest.findOne({

            $or: [

                {

                    sender: userId,

                    receiver: otherUserId

                },

                {

                    sender: otherUserId,

                    receiver: userId

                }

            ]

        });

        if (!request) {

            return {

                status: "none"

            };

        }

        return {

            status: request.status,

            direction:

                request.sender.toString() ===
                    userId.toString()

                    ? "sent"

                    : "received",

            request

        };

    }

    async createDirectConversation(userId, otherUserId) {

        const existingConversation = await this.findDirectConversation(
            userId,
            otherUserId
        );

        if (existingConversation) {
            return existingConversation;
        }

        const conversation = await Conversation.create({
            type: "direct",
            participants: [
                {
                    user: userId
                },
                {
                    user: otherUserId
                }
            ],
            createdBy: userId
        });

        await ChatRequest.findOneAndUpdate(
            {
                sender: userId,
                receiver: otherUserId,
                status: "accepted"
            },
            {
                conversation: conversation._id
            }
        );

        await ChatRequest.findOneAndUpdate(
            {
                sender: otherUserId,
                receiver: userId,
                status: "accepted"
            },
            {
                conversation: conversation._id
            }
        );

        return conversation;

    }

    async createGroupConversation({
        name,
        image = "",
        participants,
        admins,
        team,
        createdBy,
        session = null
    }) {

        const uniqueParticipants = [
            ...new Set([
                ...participants.map(id => id.toString()),
                createdBy.toString()
            ])
        ];

        const conversation = await Conversation.create(
            [{
                type: "group",
                name,
                image,
                participants: uniqueParticipants.map(user => ({
                    user
                })),
                admins,
                team,
                createdBy
            }],
            session ? { session } : {}
        );

        return conversation[0];
    }

    async getConversationById(conversationId) {

        return await Conversation.findById(conversationId)
            .populate(
                "participants.user",
                "fullName username avatar isVerified"
            )
            .populate(
                "admins",
                "fullName username avatar"
            )
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    select: "fullName username avatar"
                }
            });

    }

    async getUserConversations(userId) {

        return await Conversation.find({
            "participants.user": userId,
            isDeleted: false
        })
            .populate(
                "participants.user",
                "fullName username avatar isVerified"
            )
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    select: "fullName username avatar"
                }
            })
            .sort({
                lastActivity: -1
            });

    }

    async addParticipants(conversationId, participantIds) {

        return await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $addToSet: {
                    participants: {
                        $each: participantIds.map(user => ({
                            user
                        }))
                    }
                }
            },
            {
                new: true
            }
        );

    }

    async removeParticipant(conversationId, userId) {

        return await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $pull: {
                    participants: {
                        user: userId
                    }
                }
            },
            {
                new: true
            }
        );

    }

    async updateGroup(conversationId, data) {

        return await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $set: {
                    ...data,
                    updatedBy: data.updatedBy
                }
            },
            {
                new: true
            }
        );

    }

    async archiveConversation(conversationId, userId) {

        return await Conversation.findOneAndUpdate(
            {
                _id: conversationId,
                "participants.user": userId
            },
            {
                $set: {
                    "participants.$.isArchived": true
                }
            },
            {
                new: true
            }
        );

    }

    async unarchiveConversation(conversationId, userId) {

        return await Conversation.findOneAndUpdate(
            {
                _id: conversationId,
                "participants.user": userId
            },
            {
                $set: {
                    "participants.$.isArchived": false
                }
            },
            {
                new: true
            }
        );

    }

    async muteConversation(conversationId, userId) {

        return await Conversation.findOneAndUpdate(
            {
                _id: conversationId,
                "participants.user": userId
            },
            {
                $set: {
                    "participants.$.isMuted": true
                }
            },
            {
                new: true
            }
        );

    }

    async unmuteConversation(conversationId, userId) {

        return await Conversation.findOneAndUpdate(
            {
                _id: conversationId,
                "participants.user": userId
            },
            {
                $set: {
                    "participants.$.isMuted": false
                }
            },
            {
                new: true
            }
        );

    }

    async updateLastMessage(conversationId, messageId) {

        return await Conversation.findByIdAndUpdate(
            conversationId,
            {
                lastMessage: messageId,
                lastActivity: new Date(),
                lastMessageAt: new Date()
            }
        );

    }

}

export default new ConversationService();