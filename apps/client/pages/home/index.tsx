import { PostForm } from '../../components/postForm';
import { PostFAB } from '../../components/postFAB';

export default function Index() {
  return (
    <div>
      <div className="hidden sm:block">
        <PostForm />
      </div>

      <div className="sm:hidden absolute bottom-16 right-5">
        <PostFAB />
      </div>
    </div>
  );
}
