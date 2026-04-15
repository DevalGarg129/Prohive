// src/store/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/notifications');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const markAllRead = createAsyncThunk('notifications/markRead', async (_, { rejectWithValue }) => {
  try {
    await api.put('/notifications/read-all');
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], unread: 0, isLoading: false },
  reducers: {
    pushNotification(state, action) {
      state.list.unshift(action.payload);
      state.unread += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => { s.isLoading = true; })
      .addCase(fetchNotifications.fulfilled, (s, a) => {
        s.isLoading = false;
        s.list = a.payload.notifications;
        s.unread = a.payload.unreadCount;
      })
      .addCase(markAllRead.fulfilled, (s) => {
        s.list = s.list.map((n) => ({ ...n, isRead: true }));
        s.unread = 0;
      });
  },
});

export const { pushNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
