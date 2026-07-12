import api from "../api/axios";

export const registerUser = (formData) =>
    api.post("/users/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const loginUser = (data) =>
    api.post("/users/login", data);

export const logoutUser = () =>
    api.post("/users/logout");

export const getCurrentUser = () =>
    api.get("/users/current-user");

export const updateProfile = (data) =>
    api.patch("/users/update-account", data);

export const updateEmail = (data) =>
    api.patch(
        "/users/update-email",
        data
    );

export const changePassword = (data) =>
    api.post(
        "/users/change-password",
        data
    );

export const updateAvatar = (file) => {

    const formData = new FormData();

    formData.append("avatar", file);

    return api.patch(
        "/users/avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const updateCoverImage = (file) => {

    const formData = new FormData();

    formData.append("coverImage", file);

    return api.patch(
        "/users/cover-image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const forgotPassword = (email) =>
    api.post(
        "/users/forgot-password",
        { email }
    );

export const resetPassword = (
    token,
    password
) =>
    api.post(
        `/users/reset-password/${token}`,
        { password }
    );