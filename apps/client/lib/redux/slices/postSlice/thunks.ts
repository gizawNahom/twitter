import { createAppAsyncThunk } from '../../../redux/createAppAsyncThunk';
import { createPost } from './createPost';
import { fetchPost } from './fetchPost';

export const createPostAsync = createAppAsyncThunk(
  'post/createPost',
  async (text: string) => {
    const [post, errorMsg] = await createPost(text);
    if (errorMsg) throw new Error('error');
    return post;
  }
);

export const fetchPostAsync = createAppAsyncThunk(
  'post/fetchPost',
  async (id: string) => await fetchPost(id)
);
