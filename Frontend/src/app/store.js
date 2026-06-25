import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import recruitmentReducer from "../features/recruitment/recruitmentSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        projects: projectReducer,
        recruitment: recruitmentReducer
    },
});