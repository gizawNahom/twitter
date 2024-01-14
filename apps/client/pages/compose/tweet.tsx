import { PostInput } from '../../components/postInput';
import { BackButton } from '../../components/backButton';

export default function ComposeTweet() {
  return (
    <div className="px-4">
      <div className="flex justify-between gap-x-8 items-center pt-2">
        <BackButton />
      </div>
      <PostInput />
    </div>
  );
}
