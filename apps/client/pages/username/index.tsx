import { Posts } from '../../components/posts';
import { Page } from '../../components/page';
import { fetchPosts } from '../../lib/redux/slices/postsSlice/fetchPosts';

export default function Profile() {
  return (
    <Page isPadded={false}>
      <div className="p-2 border-b-[1px]">
        <h4 className="font-bold text-base">Posts</h4>
      </div>
      <Posts fetchPosts={(offset) => fetchPosts('userId1', offset, 20)} />
    </Page>
  );
}
