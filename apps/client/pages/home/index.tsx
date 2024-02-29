import { useSelector } from 'react-redux';
import { PostForm } from '../../components/postForm';
import { selectCreateStatus } from '../../lib/redux';
import { Toast1 } from '../../components/toast1';

export default function Index() {
  const status = useSelector(selectCreateStatus);

  return (
    <div>
      <div className="hidden sm:block">
        <PostForm />
      </div>
      {status === 'succeeded' && <Toast1 />}
    </div>
  );
}
