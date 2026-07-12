import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    user: null,

    isAuthenticated: false,

    loading: true,

    authLoading: false

}
const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        logoutUser: (state) => {

            state.user = null;

            state.isAuthenticated = false;

            state.loading = false;

        },
        setAuthChecked: (state) => {
            state.loading = false;
        },

        setAuthLoading: (state, action) => {

            state.authLoading = action.payload;

        }

    },
});

export const {
    setLoading,
    setUser,
    logoutUser,
    setAuthChecked,
    setAuthLoading
} = authSlice.actions;

export default authSlice.reducer