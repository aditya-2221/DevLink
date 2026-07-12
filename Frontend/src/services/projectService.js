import api from "../api/axios";

export const createProject = (formData) =>
    api.post(
        "/projects",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

export const getProjects = (params) =>
    api.get("/projects", {
        params
    });

export const getProjectById = (id) =>
    api.get(`/projects/${id}`);

export const getTrendingProjects = () =>
    api.get("/projects/trending");

export const getMyProjects = () =>
    api.get("/projects/my-projects");

export const likeProject = (id) =>
    api.post(`/projects/${id}/like`);

export const unlikeProject = (id) =>
    api.delete(`/projects/${id}/like`);

export const bookmarkProject = (id) =>
    api.post(`/projects/${id}/bookmark`);

export const removeBookmark = (id) =>
    api.delete(`/projects/${id}/bookmark`);


export const getComments = (projectId, params) =>
    api.get(`/projects/${projectId}/comments`, {
        params
    });

export const addComment = (projectId, data) =>
    api.post(
        `/projects/${projectId}/comments`,
        data
    );

export const updateComment = (
    commentId,
    data
) =>
    api.patch(
        `/projects/comments/${commentId}`,
        data
    );

export const deleteComment = (commentId) =>
    api.delete(
        `/projects/comments/${commentId}`
    );

export const getProjectsByUsername = (
    username
) =>
    api.get(
        `/projects/user/${username}`
    );

export const deleteProject = (projectId) =>
    api.delete(`/projects/${projectId}`);

export const updateProject = (
    projectId,
    formData
) =>
    api.patch(
        `/projects/${projectId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );