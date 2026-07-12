import mongoose from "mongoose";

import { ChatRequest } from "../models/chatRequest.model.js";
import { User } from "../models/user.model.js";

class ChatRequestService {

    async createRequest({
        sender,
        receiver,
        message = ""
    }) {

        const existingRequest = await ChatRequest.findOne({
            $or: [
                {
                    sender,
                    receiver
                },
                {
                    sender: receiver,
                    receiver: sender
                }
            ],
            status: {
                $in: ["pending", "accepted", "blocked"]
            }
        });

        if (existingRequest) {
            return existingRequest;
        }

        return await ChatRequest.create({
            sender,
            receiver,
            message
        });

    }

    async getRequestById(requestId) {

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return null;
        }

        return await ChatRequest.findById(requestId)
            .populate(
                "sender",
                "fullName username avatar isVerified"
            )
            .populate(
                "receiver",
                "fullName username avatar isVerified"
            )
            .populate("conversation");

    }

    async getPendingRequests(userId) {

        return await ChatRequest.find({
            receiver: userId,
            status: "pending"
        })
            .populate(
                "sender",
                "fullName username avatar isVerified"
            )
            .sort({
                createdAt: -1
            });

    }

    async getSentRequests(userId) {

        return await ChatRequest.find({
            sender: userId,
            status: "pending"
        })
            .populate(
                "receiver",
                "fullName username avatar isVerified"
            )
            .sort({
                createdAt: -1
            });

    }

    async acceptRequest(requestId, conversationId) {

        return await ChatRequest.findByIdAndUpdate(
            requestId,
            {
                status: "accepted",
                conversation: conversationId
            },
            {
                new: true
            }
        )
            .populate(
                "sender",
                "fullName username avatar isVerified"
            )
            .populate(
                "receiver",
                "fullName username avatar isVerified"
            )
            .populate("conversation");

    }

    async rejectRequest(requestId) {

        return await ChatRequest.findByIdAndUpdate(
            requestId,
            {
                status: "rejected"
            },
            {
                new: true
            }
        );

    }

    async blockRequest(requestId) {

        return await ChatRequest.findByIdAndUpdate(
            requestId,
            {
                status: "blocked"
            },
            {
                new: true
            }
        );

    }

    async deleteRequest(requestId) {

        return await ChatRequest.findByIdAndDelete(requestId);

    }

    async getRelationship(userId, otherUserId) {

        return await ChatRequest.findOne({
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

    }

    async canMessage(userId, otherUserId) {

        const receiver = await User.findById(otherUserId);

        if (!receiver) {
            return false;
        }

        if (receiver.messagePrivacy === "everyone") {
            return true;
        }

        const relationship = await this.getRelationship(
            userId,
            otherUserId
        );

        if (!relationship) {
            return false;
        }

        return relationship.status === "accepted";

    }

}

export default new ChatRequestService();