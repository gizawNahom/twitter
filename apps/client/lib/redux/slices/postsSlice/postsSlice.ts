import { createSlice } from '@reduxjs/toolkit';
import { Post } from './post';
import { createPostAsync, fetchPostAsync } from './thunks';

const initialState: PostsSliceState = {
  createdPost: null,
  createStatus: 'idle',
  fetchStatus: 'idle',
  fetchedPost: null,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPostAsync.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.createdPost = action.payload;
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.createStatus = 'failed';
      });

    builder
      .addCase(fetchPostAsync.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchPostAsync.rejected, (state) => {
        state.fetchStatus = 'failed';
      })
      .addCase(fetchPostAsync.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.fetchedPost = action.payload;
      });
  },
});

export interface PostsSliceState {
  createdPost: Post | null;
  createStatus: 'idle' | 'loading' | 'failed' | 'succeeded';
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchedPost: Post | null;
}
