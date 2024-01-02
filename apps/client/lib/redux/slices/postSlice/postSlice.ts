import { createSlice } from '@reduxjs/toolkit';
import { Post } from './post';
import { createPostAsync, fetchPostAsync } from './thunks';

const initialState: PostSliceState = {
  post: null,
  status: 'idle',
  fetchStatus: 'idle',
  fetchedPost: null,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPostAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.post = action.payload;
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.status = 'failed';
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

export interface PostSliceState {
  post: Post | null;
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchedPost: Post | null;
}
