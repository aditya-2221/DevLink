import api from "../api/axios";

export const createTeam = (data) =>
    api.post("/teams", data);

export const getMyTeams = () =>
    api.get("/teams/my-teams");

export const getTeamById = (teamId) =>
    api.get(`/teams/${teamId}`);

export const updateTeam = (teamId, data) =>
    api.patch(`/teams/${teamId}`, data);

export const deleteTeam = (teamId) =>
    api.delete(`/teams/${teamId}`);

export const addMember = (
    teamId,
    userId
) =>
    api.post(
        `/teams/${teamId}/members`,
        { userId }
    );

export const removeMember = (
    teamId,
    userId
) =>
    api.delete(
        `/teams/${teamId}/members/${userId}`
    );

export const inviteMember = (
    teamId,
    receiverId,
    message = ""
) =>
    api.post(
        `/teams/${teamId}/invite`,
        {
            receiverId,
            message
        }
    );

export const getMyInvitations = () =>
    api.get("/teams/invitations");

export const acceptInvitation = (invitationId) =>
    api.patch(
        `/teams/invitations/${invitationId}/accept`
    );

export const rejectInvitation = (invitationId) =>
    api.patch(
        `/teams/invitations/${invitationId}/reject`
    );

export const getPendingInvitations = (teamId) =>
    api.get(
        `/teams/${teamId}/invitations`
    );

export const cancelInvitation = (invitationId) =>
    api.delete(
        `/teams/invitations/${invitationId}`
    );

export const createAnnouncement = (
    teamId,
    title,
    content
) =>
    api.post(
        `/teams/${teamId}/announcements`,
        {
            title,
            content
        }
    );

export const getAnnouncements = (teamId) =>
    api.get(
        `/teams/${teamId}/announcements`
    );

export const updateAnnouncement = (
    teamId,
    announcementId,
    title,
    content
) =>
    api.patch(
        `/teams/${teamId}/announcements/${announcementId}`,
        {
            title,
            content
        }
    );

export const deleteAnnouncement = (
    teamId,
    announcementId
) =>
    api.delete(
        `/teams/${teamId}/announcements/${announcementId}`
    );

export const togglePinAnnouncement = (
    teamId,
    announcementId
) =>
    api.patch(
        `/teams/${teamId}/announcements/${announcementId}/pin`
    );
