import { PostInput } from '../../components/postInput';
import { Page } from '../../components/page';

export default function ComposeTweet() {
  return (
    <Page>
      <PostInput autoFocus={true} />
    </Page>
  );
}
