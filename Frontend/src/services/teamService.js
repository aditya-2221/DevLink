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

export const createAnnouncement = (
    teamId,
    message
) =>
    api.post(
        `/teams/${teamId}/announcements`,
        { message }
    );