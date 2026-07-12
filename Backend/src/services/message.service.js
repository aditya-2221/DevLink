import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";

class MessageService {

    async createMessage({
        conversationId,
        sender,
        content = "",
        type = "TEXT",
        attachments = [],
        replyTo = null
    }) {

        const message = await Message.create({
            conversation: conversationId,
            sender,
            type,
            content,
            attachments,
            replyTo,
            readBy: [
                {
                    user: sender
                }
            ]
        });

        await Conversation.findByIdAndUpdate(
            conversationId,
            {
                lastMessage: message._id,
                lastActivity: new Date(),
                lastMessageAt: new Date()
            }
        );

        return await this.getMessageById(message._id);

    }

    async getMessageById(messageId) {

        return await Message.findById(messageId)
            .populate(
                "sender",
                "fullName username avatar isVerified"
            )
            .populate(
                "replyTo"
            );

    }

    async getConversationMessages(
        conversationId,
        page = 1,
        limit = 30
    ) {

        const skip = (page - 1) * limit;

        const messages = await Message.find({
            conversation: conversationId,
            deleted: false
        })
            .populate(
                "sender",
                "fullName username avatar isVerified"
            )
            .populate({
                path: "replyTo",
                populate: {
                    path: "sender",
                    select: "fullName username avatar"
                }
            })
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit);

        const totalMessages = await Message.countDocuments({
            conversation: conversationId,
            deleted: false
        });

        return {
            messages: messages.reverse(),
            totalMessages,
            totalPages: Math.ceil(totalMessages / limit),
            currentPage: page
        };

    }

    async editMessage(
        messageId,
        content
    ) {

        return await Message.findByIdAndUpdate(
            messageId,
            {
                content,
                edited: true
            },
            {
                new: true
            }
        )
            .populate(
                "sender",
                "fullName username avatar isVerified"
            )
            .populate({
                path: "replyTo",
                populate: {
                    path: "sender",
                    select: "fullName username avatar"
                }
            });

    }

    async deleteMessage(messageId) {

        return await Message.findByIdAndUpdate(
            messageId,
            {
                deleted: true,
                content: "This message was deleted.",
                attachments: [],
                replyTo: null
            },
            {
                new: true
            }
        );

    }

    async markMessageAsRead(
        messageId,
        userId
    ) {

        return await Message.findByIdAndUpdate(
            messageId,
            {
                $addToSet: {
                    readBy: {
                        user: userId,
                        readAt: new Date()
                    }
                }
            },
            {
                new: true
            }
        );

    }

    async markConversationAsRead(
        conversationId,
        userId,
        lastMessageId
    ) {

        await Message.updateMany(
            {
                conversation: conversationId,
                "readBy.user": {
                    $ne: userId
                }
            },
            {
                $push: {
                    readBy: {
                        user: userId,
                        readAt: new Date()
                    }
                }
            }
        );

        await Conversation.updateOne(
            {
                _id: conversationId,
                "participants.user": userId
            },
            {
                $set: {
                    "participants.$.lastReadMessage": lastMessageId
                }
            }
        );

    }

    async getUnreadCount(
        conversationId,
        userId
    ) {

        return await Message.countDocuments({
            conversation: conversationId,
            sender: {
                $ne: userId
            },
            deleted: false,
            "readBy.user": {
                $ne: userId
            }
        });

    }

    async searchMessages(
        conversationId,
        query
    ) {

        return await Message.find({
            conversation: conversationId,
            deleted: false,
            $text: {
                $search: query
            }
        })
            .populate(
                "sender",
                "fullName username avatar"
            )
            .sort({
                score: {
                    $meta: "textScore"
                }
            });

    }

}

export default new MessageService();