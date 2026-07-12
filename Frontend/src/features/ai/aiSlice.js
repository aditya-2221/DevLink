import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as aiService from "../../services/aiService";

const initialState = {

    loading: false,

    output: "",

    error: null

};

export const generateDescription = createAsyncThunk(

    "ai/generateDescription",

    async (projectId, thunkAPI) => {

        try {

            const res = await aiService.generateDescription(projectId);

            return res.data.data;

        }

        catch (err) {

            return thunkAPI.rejectWithValue(

                err.response?.data?.message ||

                err.message

            );

        }

    }

);

export const generateReadme = createAsyncThunk(

    "ai/generateReadme",

    async (projectId, thunkAPI) => {

        try {

            const res = await aiService.generateReadme(projectId);

            return res.data.data;

        }

        catch (err) {

            return thunkAPI.rejectWithValue(

                err.response?.data?.message ||

                err.message

            );

        }

    }

);

export const generateReport = createAsyncThunk(

    "ai/generateReport",

    async (projectId, thunkAPI) => {

        try {

            const res = await aiService.generateReport(projectId);

            return res.data.data;

        }

        catch (err) {

            return thunkAPI.rejectWithValue(

                err.response?.data?.message ||

                err.message

            );

        }

    }

);

export const reviewProject = createAsyncThunk(

    "ai/reviewProject",

    async (projectId, thunkAPI) => {

        try {

            const res = await aiService.reviewProject(projectId);

            return res.data.data;

        }

        catch (err) {

            return thunkAPI.rejectWithValue(

                err.response?.data?.message ||

                err.message

            );

        }

    }

);

const aiSlice = createSlice({

    name: "ai",

    initialState,

    reducers: {

        clearAIOutput: (state) => {

            state.output = "";

            state.error = null;

        }

    },

    extraReducers: builder => {

        builder

            .addMatcher(

                action =>

                    action.type.startsWith("ai/") &&

                    action.type.endsWith("/pending"),

                state => {

                    state.loading = true;

                    state.error = null;

                }

            )

            .addMatcher(

                action =>

                    action.type.startsWith("ai/") &&

                    action.type.endsWith("/fulfilled"),

                (state, action) => {

                    state.loading = false;

                    state.output = action.payload;

                }

            )

            .addMatcher(

                action =>

                    action.type.startsWith("ai/") &&

                    action.type.endsWith("/rejected"),

                (state, action) => {

                    state.loading = false;

                    state.error = action.payload;

                }

            );

    }

});

export const {

    clearAIOutput

} = aiSlice.actions;

export default aiSlice.reducer;