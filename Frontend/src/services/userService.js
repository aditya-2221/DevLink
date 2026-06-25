import api from "../api/axios";

export const getUserProfile = (
    username
) =>
    api.get(
        `/users/profile/${username}`
    );