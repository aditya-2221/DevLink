import api from "../api/axios";

export const getRecruitments = (params) =>
    api.get("/recruitments", { params });

export const getRecruitmentById = (id) =>
    api.get(`/recruitments/${id}`);

export const createRecruitment = (data) =>
    api.post("/recruitments", data);

export const updateRecruitment = (id, data) =>
    api.patch(`/recruitments/${id}`, data);

export const deleteRecruitment = (id) =>
    api.delete(`/recruitments/${id}`);

export const applyToRecruitment = (
    recruitmentId,
    data
) =>
    api.post(
        `/recruitments/${recruitmentId}/apply`,
        data
    );

export const getRecruitmentApplications = (
    recruitmentId
) =>
    api.get(
        `/recruitments/${recruitmentId}/applications`
    );

export const acceptApplication = (
    applicationId
) =>
    api.patch(
        `/recruitments/applications/${applicationId}/accept`
    );

export const rejectApplication = (
    applicationId
) =>
    api.patch(
        `/recruitments/applications/${applicationId}/reject`
    );

export const getMyRecruitments = (params) =>
    api.get(
        "/recruitments/my-recruitments",
        { params }
    );

export const getMyApplications = (params) =>
    api.get(
        "/recruitments/my-applications",
        { params }
    );

export const getRecruitmentSkills =
    () => api.get(
        "/recruitments/skills"
    );