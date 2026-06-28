import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    todo: [],

    inProgress: [],

    done: [],

    counts: {},

    loading: false,

    error: null

};

const taskSlice = createSlice({

    name: "task",

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

        setTasks: (
            state,
            action
        ) => {

            state.todo =
                action.payload.todo;

            state.inProgress =
                action.payload.inProgress;

            state.done =
                action.payload.done;

            state.counts =
                action.payload.counts;

        }

    }

});

export const {

    setLoading,

    setError,

    clearError,

    setTasks

} = taskSlice.actions;

export default taskSlice.reducer;