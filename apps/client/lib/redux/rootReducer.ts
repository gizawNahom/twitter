/* Instruments */
import { postsSlice, messagesSlice } from './slices';

export const reducer = {
  posts: postsSlice.reducer,
  messages: messagesSlice.reducer,
};
