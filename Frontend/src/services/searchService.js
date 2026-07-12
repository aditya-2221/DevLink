import api from "../api/axios";

export const globalSearch = ({
    query,
    type = "all",
    page = 1,
    limit = 5,
}) => {
    return api.get("/search", {
        params: {
            q: query,
            type,
            page,
            limit,
        },
    });
};

export const searchUsers = (
    query,
    page = 1,
    limit = 10
) => {
    return globalSearch({
        query,
        type: "users",
        page,
        limit,
    });
};

export const searchProjects = (
    query,
    page = 1,
    limit = 10
) => {
    return globalSearch({
        query,
        type: "projects",
        page,
        limit,
    });
};