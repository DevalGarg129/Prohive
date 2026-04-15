// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    createPostOpen: false,
    editProfileOpen: false,
    postDetailId: null,
    snackbar: { open: false, message: '', severity: 'success' },
  },
  reducers: {
    openCreatePost(state) { state.createPostOpen = true; },
    closeCreatePost(state) { state.createPostOpen = false; },
    openEditProfile(state) { state.editProfileOpen = true; },
    closeEditProfile(state) { state.editProfileOpen = false; },
    setPostDetail(state, action) { state.postDetailId = action.payload; },
    showSnack(state, action) {
      state.snackbar = { open: true, message: action.payload.message, severity: action.payload.severity || 'success' };
    },
    hideSnack(state) { state.snackbar.open = false; },
  },
});

export const { openCreatePost, closeCreatePost, openEditProfile, closeEditProfile, setPostDetail, showSnack, hideSnack } = uiSlice.actions;
export default uiSlice.reducer;
