import { createAppAsyncThunk } from '../../../redux/createAppAsyncThunk';
import { createPost } from './createPost';

export const createPostAsync = createAppAsyncThunk(
  'post/createPost',
  async (text: string) => {
    const [post, errorMsg] = await createPost(text);
    if (errorMsg) throw new Error('error');
    return post;
  }
);
