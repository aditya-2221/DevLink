import api from "../api/axios";

export const getNotifications = (params = {}) =>
    api.get("/notifications", { params });

export const markNotificationAsRead = (notificationId) =>
    api.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsAsRead = () =>
    api.patch("/notifications/read-all");

export const deleteNotification = (notificationId) =>
    api.delete(`/notifications/${notificationId}`);

export const acceptTeamInvitation = (invitationId) =>
    api.patch(
        `/teams/invitations/${invitationId}/accept`
    );

export const rejectTeamInvitation = (invitationId) =>
    api.patch(
        `/teams/invitations/${invitationId}/reject`
    );