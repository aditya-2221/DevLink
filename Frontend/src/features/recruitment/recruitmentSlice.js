import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    recruitments: [],
    currentRecruitment: null,

    myRecruitments: [],
    myApplications: [],

    applications: [],

    page: 1,
    totalPages: 1,
    totalRecruitments: 0,

    loading: false,
    error: null
};

const recruitmentSlice = createSlice({
    name: "recruitment",

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

        setRecruitments: (
            state,
            action
        ) => {
            state.recruitments = action.payload;
        },

        setCurrentRecruitment: (
            state,
            action
        ) => {
            state.currentRecruitment =
                action.payload;
        },

        setMyRecruitments: (
            state,
            action
        ) => {
            state.myRecruitments =
                action.payload;
        },

        setMyApplications: (
            state,
            action
        ) => {
            state.myApplications =
                action.payload;
        },

        setApplications: (
            state,
            action
        ) => {
            state.applications =
                action.payload;
        },

        setPagination: (
            state,
            action
        ) => {
            state.page =
                action.payload.page;

            state.totalPages =
                action.payload.totalPages;

            state.totalRecruitments =
                action.payload.totalRecruitments;
        },

        addRecruitment: (
            state,
            action
        ) => {
            state.recruitments.unshift(
                action.payload
            );
        },

        removeRecruitment: (
            state,
            action
        ) => {
            state.recruitments =
                state.recruitments.filter(
                    (recruitment) =>
                        recruitment._id !==
                        action.payload
                );
        }
    }
});

export const {
    setLoading,
    setError,
    clearError,

    setRecruitments,
    setCurrentRecruitment,

    setMyRecruitments,
    setMyApplications,

    setApplications,

    setPagination,

    addRecruitment,
    removeRecruitment
} = recruitmentSlice.actions;

export default recruitmentSlice.reducer;