import { Posts } from '../../components/posts';
import { Page } from '../../components/page';

export default function Profile() {
  return (
    <div>
      <Page>
        <h4>Posts</h4>
        <Posts />
      </Page>
    </div>
  );
}
