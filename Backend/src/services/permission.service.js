import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { Team } from "../models/team.model.js";

class PermissionService {

    async getConversation(conversationId) {

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return null;
        }

        return await Conversation.findById(conversationId);

    }

    async isConversationMember(conversationId, userId) {

        const conversation = await this.getConversation(conversationId);

        if (!conversation) {
            return false;
        }

        return conversation.participants.some(
            (participant) =>
                participant.user.toString() === userId.toString()
        );

    }

    async getAuthorizedConversation(conversationId, userId) {

        const conversation = await this.getConversation(conversationId);

        if (!conversation) {
            return null;
        }

        const isMember = conversation.participants.some(
            (participant) =>
                participant.user.toString() === userId.toString()
        );

        if (!isMember) {
            return null;
        }

        return conversation;

    }

    async isConversationAdmin(conversationId, userId) {

        const conversation = await this.getConversation(conversationId);

        if (!conversation) {
            return false;
        }

        return conversation.admins.some(
            (admin) =>
                admin.toString() === userId.toString()
        );

    }

    async isTeamMember(teamId, userId) {

        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return false;
        }

        const team = await Team.findById(teamId);

        if (!team) {
            return false;
        }

        if (team.owner.toString() === userId.toString()) {
            return true;
        }

        return team.members.some(
            (member) =>
                member.user.toString() === userId.toString()
        );

    }

    async isTeamOwner(teamId, userId) {

        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return false;
        }

        const team = await Team.findById(teamId);

        if (!team) {
            return false;
        }

        return team.owner.toString() === userId.toString();

    }

    async canCreateGroup(teamId, userId) {

        return await this.isTeamMember(teamId, userId);

    }

    async canSendMessage(conversationId, userId) {

        return await this.isConversationMember(
            conversationId,
            userId
        );

    }

    isMessageOwner(message, userId) {

        if (!message) return false;

        return (
            (message.sender._id ?? message.sender)
                .toString() === userId.toString()
        );

    }

}

export default new PermissionService();