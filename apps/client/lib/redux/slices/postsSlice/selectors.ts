import type { ReduxState } from '../..';

export const selectCreatedPost = (state: ReduxState) => state.posts.createdPost;

export const selectStatus = (state: ReduxState) => state.posts.createStatus;

export const selectFetchStatus = (state: ReduxState) => state.posts.fetchStatus;

export const selectFetchedPost = (state: ReduxState) => state.posts.fetchedPost;
