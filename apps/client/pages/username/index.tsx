import { Posts } from '../../components/posts';
import { Page } from '../../components/page';

export default function Profile() {
  return (
    <div>
      <Page padded={false}>
        <div className="p-2 border-b-[1px]">
          <h4 className="font-bold text-base">Posts</h4>
        </div>
        <Posts userId="userId1" />
      </Page>
    </div>
  );
}
