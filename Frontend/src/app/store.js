import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import recruitmentReducer from "../features/recruitment/recruitmentSlice";
import teamReducer from "../features/teams/teamSlice";
import taskReducer from "../features/tasks/taskSlice";
import resourceReducer from "../features/resources/resourceSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import chatReducer from "../features/chat/chatSlice";
import searchReducer from "../features/search/searchSlice";
import aiReducer from "../features/ai/aiSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        projects: projectReducer,
        recruitment: recruitmentReducer,
        teams: teamReducer,
        tasks: taskReducer,
        resources: resourceReducer,
        notification: notificationReducer,
        chat: chatReducer,
        search: searchReducer,
        ai: aiReducer
    },
});