import { createSlice } from '@reduxjs/toolkit';
import { Post } from '../../../../utilities/client';
import { createPostAsync } from './thunks';

const initialState: PostSliceState = {
  post: null,
  status: 'idle',
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
        // state.status = 'idle';
        // state.post = action.payload;
        state.status = 'succeeded';
        state.post = action.payload;
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export interface PostSliceState {
  post: Post | null;
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
}
