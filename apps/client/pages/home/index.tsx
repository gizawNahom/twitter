import { useSelector } from 'react-redux';
import { PostForm } from '../../components/postForm';
import { selectCreateStatus } from '../../lib/redux';
import { Toast } from '../../components/toast';
import { Page } from '../../components/page';

export default function Index() {
  const status = useSelector(selectCreateStatus);

  return (
    <Page header={<></>}>
      <div className="hidden sm:block">
        <PostForm />
      </div>
      {status === 'succeeded' && <Toast />}
    </Page>
  );
}
