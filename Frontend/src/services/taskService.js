import api from "../api/axios";

export const createTask = (data) =>
    api.post("/tasks", data);

export const getTeamTasks = (
    teamId
) =>
    api.get(
        `/tasks/team/${teamId}`
    );

export const getTaskById = (
    taskId
) =>
    api.get(`/tasks/${taskId}`);

export const updateTask = (
    taskId,
    data
) =>
    api.patch(
        `/tasks/${taskId}`,
        data
    );

export const moveTask = (
    taskId,
    status
) =>
    api.patch(
        `/tasks/${taskId}/status`,
        { status }
    );

export const assignTask = (
    taskId,
    assignedTo
) =>
    api.patch(
        `/tasks/${taskId}/assign`,
        { assignedTo }
    );

export const deleteTask = (
    taskId
) =>
    api.delete(
        `/tasks/${taskId}`
    );