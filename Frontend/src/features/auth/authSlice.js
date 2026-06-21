import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true
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
        },
        setAuthChecked: (state) => {
            state.loading = false;
        }
    },
});

export const {
    setLoading,
    setUser,
    logoutUser,
    setAuthChecked
} = authSlice.actions;

export default authSlice.reducer