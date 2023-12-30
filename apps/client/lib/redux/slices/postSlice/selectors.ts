import type { ReduxState } from '../../../redux';

export const selectPost = (state: ReduxState) => state.post.post;

export const selectStatus = (state: ReduxState) => state.post.status;
