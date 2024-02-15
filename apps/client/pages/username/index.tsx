import { Posts } from '../../components/posts';
import { Page } from '../../components/page';

export default function Profile() {
  return (
    <div>
      <Page padded={false}>
        <div className=" border-b-[1px]">
          <h4>Posts</h4>
        </div>
        <Posts userId="userId1" />
      </Page>
    </div>
  );
}
