import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../../services/notificationService";

export const fetchNotifications = createAsyncThunk(
    "notification/fetchNotifications",
    async (params = {}, thunkAPI) => {
        try {
            const response = await getNotifications(params);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch notifications"
            );
        }
    }
);

export const readNotification = createAsyncThunk(
    "notification/readNotification",
    async (notificationId, thunkAPI) => {
        try {
            await markNotificationAsRead(notificationId);
            return notificationId;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to mark notification as read"
            );
        }
    }
);

export const readAllNotifications = createAsyncThunk(
    "notification/readAllNotifications",
    async (_, thunkAPI) => {
        try {
            await markAllNotificationsAsRead();
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to mark notifications as read"
            );
        }
    }
);

export const removeNotification = createAsyncThunk(
    "notification/removeNotification",
    async (notificationId, thunkAPI) => {
        try {
            await deleteNotification(notificationId);
            return notificationId;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete notification"
            );
        }
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,
    hasMore: false,
    loading: false,
    error: null
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.hasMore = false;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.myNotifications;
                state.unreadCount = action.payload.unreadCount;
                state.hasMore = action.payload.hasMore;
            })

            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(readNotification.fulfilled, (state, action) => {
                const notification = state.notifications.find(
                    (item) => item._id === action.payload
                );

                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })

            .addCase(readAllNotifications.fulfilled, (state) => {
                state.notifications.forEach((notification) => {
                    notification.isRead = true;
                });

                state.unreadCount = 0;
            })

            .addCase(removeNotification.fulfilled, (state, action) => {
                const notification = state.notifications.find(
                    (item) => item._id === action.payload
                );

                if (notification && !notification.isRead) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }

                state.notifications = state.notifications.filter(
                    (item) => item._id !== action.payload
                );
            });
    }
});

export const { clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;