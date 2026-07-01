import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import recruitmentReducer from "../features/recruitment/recruitmentSlice";
import teamReducer from "../features/teams/teamSlice";
import taskReducer from "../features/tasks/taskSlice";
import resourceReducer from "../features/resources/resourceSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        projects: projectReducer,
        recruitment: recruitmentReducer,
        teams: teamReducer,
        tasks: taskReducer,
        resources: resourceReducer
    },
});