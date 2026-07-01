import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    resources: [],

    loading: false,

    error: null,

    total: 0,

    totalPages: 1,

    page: 1,

    search: "",

    type: "ALL",

    sort: "latest"

};

const resourceSlice = createSlice({

    name: "resources",

    initialState,

    reducers: {

        setLoading(state, action) {

            state.loading = action.payload;

        },

        setResources(state, action) {

            state.resources =action.payload.resources;

            state.total =action.payload.total;

            state.totalPages =action.payload.totalPages;

        },

        setError(state, action) {

            state.error = action.payload;

        },

        setSearch(state, action) {

            state.search = action.payload;

        },

        setType(state, action) {

            state.type = action.payload;

        },

        setSort(state, action) {

            state.sort = action.payload;

        },

        setPage(state, action) {

            state.page = action.payload;

        }

    }

});

export const {

    setLoading,

    setResources,

    setError,

    setSearch,

    setType,

    setSort,

    setPage

} = resourceSlice.actions;

export default resourceSlice.reducer;