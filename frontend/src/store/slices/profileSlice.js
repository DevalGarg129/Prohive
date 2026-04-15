// src/store/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchProfile = createAsyncThunk('profile/fetch', async (username, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/users/${username}`);
    return { username, ...data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'User not found');
  }
});

export const followUser = createAsyncThunk('profile/follow', async (userId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/users/follow/${userId}`);
    return { userId, ...data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: { profiles: {}, isLoading: false, error: null },
  reducers: {
    clearProfileError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.isLoading = false;
        s.profiles[a.payload.username] = a.payload;
      })
      .addCase(fetchProfile.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
