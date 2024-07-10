import Image from 'next/image';
import { useEffect } from 'react';
import { createDefaultHeader, Page } from '../../components/page';
import { useRouter } from 'next/router';
import { MESSAGES_ROUTE } from '../../utilities/constants';
import { useSelector } from 'react-redux';
import { selectSelectedUser } from '../../lib/redux/';

export default function Chat() {
  const router = useRouter();
  const user = useSelector(selectSelectedUser);

  useEffect(() => {
    if (!user) router.push(MESSAGES_ROUTE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page
      header={createDefaultHeader(
        <div>
          {user && (
            <div>
              <div className="w-10 h-10 relative rounded-full overflow-hidden">
                <Image
                  src={user.profilePic}
                  alt={`${user.username}'s profile picture`}
                  fill
                  className="object-cover"
                />
              </div>
              <p>{user.displayName}</p>
            </div>
          )}
        </div>
      )}
    >
      <div>
        <input type="text" placeholder="Start a new message" />
        <button aria-label="send" disabled>
          send
        </button>
      </div>
    </Page>
  );
}
