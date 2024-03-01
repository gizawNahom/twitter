import { PostForm } from '../../components/postForm';
import { Page } from '../../components/page';
import { useEffect, useState } from 'react';
import { selectCreateStatus, useSelector } from '../../lib/redux';
import { useRouter } from 'next/router';
import { HOME_ROUTE } from 'apps/client/utilities/constants';

export default function ComposeTweet() {
  const router = useRouter();
  const currentCreateStatus = useSelector(selectCreateStatus);
  const [previousCreateStatus, setPreviousStatus] =
    useState(currentCreateStatus);

  useEffect(() => {
    if (shouldGoToHome()) goToHome();
    setPreviousStatus(currentCreateStatus);

    function shouldGoToHome() {
      return (
        previousCreateStatus !== 'succeeded' &&
        currentCreateStatus === 'succeeded'
      );
    }

    function goToHome() {
      router.push(HOME_ROUTE);
    }
  }, [currentCreateStatus, router, previousCreateStatus]);

  return (
    <Page>
      <PostForm autoFocus={true} />
    </Page>
  );
}
