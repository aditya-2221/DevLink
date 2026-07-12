import api from "../api/axios";

export const generateDescription = (projectId) =>
    api.post("/ai/generate-description", {
        projectId
    });

export const generateReadme = (projectId) =>
    api.post("/ai/generate-readme", {
        projectId
    });

export const generateReport = (projectId) =>
    api.post("/ai/generate-report", {
        projectId
    });

export const reviewProject = (projectId) =>
    api.post("/ai/review-project", {
        projectId
    });