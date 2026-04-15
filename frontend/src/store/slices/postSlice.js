// src/store/slices/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchFeed = createAsyncThunk('posts/fetchFeed', async ({ page = 1, reset = false } = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/posts/feed?page=${page}&limit=10`);
    return { ...data, reset, page };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load feed');
  }
});

export const fetchExplorePosts = createAsyncThunk('posts/fetchExplore', async (page = 1, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/posts/explore?page=${page}&limit=12`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createPost = createAsyncThunk('posts/create', async (postData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/posts', postData);
    return data.post;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create post');
  }
});

export const likePost = createAsyncThunk('posts/like', async (postId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/posts/${postId}/like`);
    return { postId, likes: data.likes, isLiked: data.isLiked };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const savePost = createAsyncThunk('posts/save', async (postId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/posts/${postId}/save`);
    return { postId, isSaved: data.isSaved };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addComment = createAsyncThunk('posts/comment', async ({ postId, text }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/posts/${postId}/comments`, { text });
    return { postId, comment: data.comment };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deletePost = createAsyncThunk('posts/delete', async (postId, { rejectWithValue }) => {
  try {
    await api.delete(`/posts/${postId}`);
    return postId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchUserPosts = createAsyncThunk('posts/userPosts', async (username, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/posts/user/${username}`);
    return { username, posts: data.posts };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    feedPosts: [],
    explorePosts: [],
    userPosts: {},
    isLoading: false,
    isCreating: false,
    error: null,
    hasMore: true,
    page: 1,
  },
  reducers: {
    // Optimistic like toggle — instant UI, no waiting
    optimisticToggleLike(state, action) {
      const { postId, userId } = action.payload;
      const targets = [
        ...state.feedPosts,
        ...state.explorePosts,
        ...Object.values(state.userPosts).flat(),
      ];
      const updatePost = (post) => {
        if (post._id !== postId) return;
        const idx = post.likes.indexOf(userId);
        if (idx > -1) {
          post.likes.splice(idx, 1);
          post.isLiked = false;
        } else {
          post.likes.push(userId);
          post.isLiked = true;
        }
      };
      state.feedPosts.forEach(updatePost);
      state.explorePosts.forEach(updatePost);
      Object.values(state.userPosts).forEach((arr) => arr.forEach(updatePost));
    },
    clearError(state) { state.error = null; },
    resetFeed(state) { state.feedPosts = []; state.page = 1; state.hasMore = true; },
  },
  extraReducers: (builder) => {
    builder
      // Feed
      .addCase(fetchFeed.pending, (s) => { s.isLoading = true; })
      .addCase(fetchFeed.fulfilled, (s, a) => {
        s.isLoading = false;
        s.feedPosts = a.payload.reset ? a.payload.posts : [...s.feedPosts, ...a.payload.posts];
        s.hasMore = a.payload.hasMore;
        s.page = a.payload.page;
      })
      .addCase(fetchFeed.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      // Explore
      .addCase(fetchExplorePosts.fulfilled, (s, a) => { s.explorePosts = a.payload.posts; })

      // Create
      .addCase(createPost.pending, (s) => { s.isCreating = true; })
      .addCase(createPost.fulfilled, (s, a) => { s.isCreating = false; s.feedPosts = [a.payload, ...s.feedPosts]; })
      .addCase(createPost.rejected, (s, a) => { s.isCreating = false; s.error = a.payload; })

      // Like — sync with server response
      .addCase(likePost.fulfilled, (s, a) => {
        const { postId, likes, isLiked } = a.payload;
        const sync = (post) => { if (post._id === postId) { post.likes = likes; post.isLiked = isLiked; } };
        s.feedPosts.forEach(sync);
        s.explorePosts.forEach(sync);
        Object.values(s.userPosts).forEach((arr) => arr.forEach(sync));
      })

      // Save
      .addCase(savePost.fulfilled, (s, a) => {
        const { postId, isSaved } = a.payload;
        const sync = (post) => { if (post._id === postId) post.isSaved = isSaved; };
        s.feedPosts.forEach(sync);
        s.explorePosts.forEach(sync);
      })

      // Comment
      .addCase(addComment.fulfilled, (s, a) => {
        const { postId, comment } = a.payload;
        const sync = (post) => { if (post._id === postId) post.comments.push(comment); };
        s.feedPosts.forEach(sync);
        s.explorePosts.forEach(sync);
      })

      // Delete
      .addCase(deletePost.fulfilled, (s, a) => {
        s.feedPosts = s.feedPosts.filter((p) => p._id !== a.payload);
        s.explorePosts = s.explorePosts.filter((p) => p._id !== a.payload);
      })

      // User posts
      .addCase(fetchUserPosts.fulfilled, (s, a) => {
        s.userPosts[a.payload.username] = a.payload.posts;
      });
  },
});

export const { optimisticToggleLike, clearError, resetFeed } = postSlice.actions;
export default postSlice.reducer;
