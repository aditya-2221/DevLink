import api from "../api/axios";

export const registerUser = (formData) =>
    api.post("/users/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const loginUser = (data) =>
    api.post("/users/login", data)

export const logoutUser = () =>
    api.post("/users/logout")

export const getCurrentUser = () =>
    api.get("/users/current-user")

export const updateProfile = (data) =>
    api.patch(
        "/users/update-account",
        data
    );