import { PostForm } from '../../components/postForm';
import { Page } from '../../components/page';

export default function ComposeTweet() {
  return (
    <Page>
      <PostForm autoFocus={true} />
    </Page>
  );
}
