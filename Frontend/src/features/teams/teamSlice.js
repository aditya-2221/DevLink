import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    teams: [],

    currentTeam: null,

    loading: false,

    error: null

};

const teamSlice = createSlice({

    name: "team",

    initialState,

    reducers: {

        setLoading: (
            state,
            action
        ) => {

            state.loading =
                action.payload;

        },

        setError: (
            state,
            action
        ) => {

            state.error =
                action.payload;

        },

        clearError: (
            state
        ) => {

            state.error = null;

        },

        setTeams: (
            state,
            action
        ) => {

            state.teams =
                action.payload;

        },

        setCurrentTeam: (
            state,
            action
        ) => {

            state.currentTeam =
                action.payload;

        },

        addTeam: (
            state,
            action
        ) => {

            state.teams.unshift(
                action.payload
            );

        },

        updateTeamState: (
            state,
            action
        ) => {

            const index =
                state.teams.findIndex(
                    team =>
                        team._id ===
                        action.payload._id
                );

            if (
                index !== -1
            ) {

                state.teams[index] =
                    action.payload;

            }

            if (
                state.currentTeam?._id ===
                action.payload._id
            ) {

                state.currentTeam =
                    action.payload;

            }

        },

        removeTeam: (
            state,
            action
        ) => {

            state.teams =
                state.teams.filter(
                    team =>
                        team._id !==
                        action.payload
                );

        }

    }

});

export const {

    setLoading,

    setError,

    clearError,

    setTeams,

    setCurrentTeam,

    addTeam,

    updateTeamState,

    removeTeam

} = teamSlice.actions;

export default teamSlice.reducer;