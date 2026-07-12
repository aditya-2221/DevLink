import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { globalSearch } from "../../services/searchService";

export const search = createAsyncThunk(
    "search/globalSearch",
    async (
        {
            query,
            type = "all",
            page = 1,
            limit = 5,
        },
        thunkAPI
    ) => {
        try {
            const response = await globalSearch({
                query,
                type,
                page,
                limit,
            });

            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Search failed"
            );
        }
    }
);

const initialState = {
    query: "",
    users: [],
    projects: [],
    loading: false,
    error: null,
    type: "all",
    page: 1,
    limit: 5,
    pagination: null,
};

const searchSlice = createSlice({
    name: "search",
    initialState,

    reducers: {

        clearSearch(state) {
            state.query = "";
            state.users = [];
            state.projects = [];
            state.loading = false;
            state.error = null;
            state.pagination = null;
        },

        setQuery(state, action) {
            state.query = action.payload;
        },

        setType(state, action) {
            state.type = action.payload;
        },

        setPage(state, action) {
            state.page = action.payload;
        },

    },

    extraReducers: (builder) => {

        builder

            .addCase(search.pending, (state) => {

                state.loading = true;
                state.error = null;

            })

            .addCase(search.fulfilled, (state, action) => {

                state.loading = false;

                state.query = action.payload.query;

                state.users = action.payload.users;

                state.projects = action.payload.projects;

                state.pagination =
                    action.payload.pagination;

            })

            .addCase(search.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });

    },

});

export const {
    clearSearch,
    setQuery,
    setType,
    setPage,
} = searchSlice.actions;

export default searchSlice.reducer;