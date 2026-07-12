import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    projects: [],
    currentProject: null,
    trendingProjects: [],

    page: 1,
    totalPages: 1,
    totalProjects: 0,

    loading: false,
    error: null,
};

const projectSlice = createSlice({
    name: "projects",

    initialState,

    reducers: {

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },

        setProjects: (state, action) => {
            state.projects = action.payload;
        },

        setCurrentProject: (state, action) => {
            state.currentProject = action.payload;
        },

        clearCurrentProject: (state) => {
            state.currentProject = null;
        },

        setTrendingProjects: (state, action) => {
            state.trendingProjects = action.payload;
        },

        addProject: (state, action) => {
            state.projects.unshift(action.payload);
        },

        updateProject: (state, action) => {

            state.projects = state.projects.map((project) =>
                project._id === action.payload._id
                    ? action.payload
                    : project
            );

            if (
                state.currentProject &&
                state.currentProject._id === action.payload._id
            ) {
                state.currentProject = action.payload;
            }
        },

        removeProject: (state, action) => {

            state.projects = state.projects.filter(
                (project) => project._id !== action.payload
            );

            state.trendingProjects = state.trendingProjects.filter(
                (project) => project._id !== action.payload
            );

            if (
                state.currentProject &&
                state.currentProject._id === action.payload
            ) {
                state.currentProject = null;
            }
        },

        toggleLike: (state, action) => {

            const projectId = action.payload;

            const project = state.projects.find(
                (p) => p._id === projectId
            );

            if (project) {

                if (project.isLiked) {
                    project.likesCount -= 1;
                } else {
                    project.likesCount += 1;
                }

                project.isLiked = !project.isLiked;
            }

            if (
                state.currentProject &&
                state.currentProject._id === projectId
            ) {

                if (state.currentProject.isLiked) {
                    state.currentProject.likesCount -= 1;
                } else {
                    state.currentProject.likesCount += 1;
                }

                state.currentProject.isLiked =
                    !state.currentProject.isLiked;
            }
        },

        toggleBookmark: (state, action) => {

            const projectId = action.payload;

            const project = state.projects.find(
                (p) => p._id === projectId
            );

            if (project) {
                project.isBookmarked =
                    !project.isBookmarked;
            }

            if (
                state.currentProject &&
                state.currentProject._id === projectId
            ) {
                state.currentProject.isBookmarked =
                    !state.currentProject.isBookmarked;
            }
        },
        setPagination: (state, action) => {
            state.page = action.payload.page;
            state.totalPages = action.payload.totalPages;
            state.totalProjects = action.payload.totalProjects;
        },
    },
});

export const {
    setLoading,
    setError,
    clearError,

    setProjects,
    setCurrentProject,
    clearCurrentProject,

    setTrendingProjects,

    addProject,
    updateProject,
    removeProject,

    toggleLike,
    toggleBookmark,
    setPagination
} = projectSlice.actions;

export default projectSlice.reducer;