import type { ReduxState } from '../../../redux';

export const selectPost = (state: ReduxState) => state.post.post;

export const selectStatus = (state: ReduxState) => state.post.status;

export const selectFetchStatus = (state: ReduxState) => state.post.fetchStatus;

export const selectFetchedPost = (state: ReduxState) => state.post.fetchedPost;
