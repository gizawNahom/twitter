import type { ReduxState } from '../../../redux';

export const selectCreatedPost = (state: ReduxState) => state.post.createdPost;

export const selectStatus = (state: ReduxState) => state.post.status;

export const selectFetchStatus = (state: ReduxState) => state.post.fetchStatus;

export const selectFetchedPost = (state: ReduxState) => state.post.fetchedPost;
