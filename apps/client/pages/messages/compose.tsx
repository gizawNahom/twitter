import Image from 'next/image';
import { useRouter } from 'next/router';
import { Page } from '../../components/page';
import { useEffect, useRef, useState } from 'react';
import { User, getUsers } from '../../../client/utilities/getUsers';
import { Error } from '../../components/error';

export default function ComposeMessage() {
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'selected'
  >();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  return (
    <Page header={renderHeader()}>
      <UserSearchInput
        onThrottledChange={onChange}
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
      />
      {selectedUser && renderSelectedUser(selectedUser)}
      {status == 'loading' && renderProgressBar()}
      {status == 'success' && renderMatchingUsers(users)}
      {status == 'error' && <Error />}
    </Page>
  );

  function renderHeader() {
    return (
      <div className="flex justify-between items-center gap-x-9">
        <div className="flex gap-x-10">
          <CloseMessagePageButton />
          <span>New message</span>
        </div>
        <NextButton isDisabled={selectedUser ? false : true} />
      </div>
    );
  }

  async function onChange(value: string) {
    try {
      setStatus('loading');
      setUsers(await getUsers(value, 10, 0));
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  }

  function renderSelectedUser(selectedUser: User) {
    return (
      <div>
        <Image
          src={selectedUser.profilePic}
          alt={`${selectedUser.username}'s profile picture`}
          width={200}
          height={200}
        />
        {selectedUser.displayName}
      </div>
    );
  }

  function renderProgressBar() {
    return <div role="progressbar"></div>;
  }

  function renderMatchingUsers(users: User[]) {
    return (
      <div>
        {users.map((u, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                setSelectedUser(u);
                setSearchInputValue('');
                setStatus('selected');
              }}
            >
              <Image
                src={u.profilePic}
                alt={`${u.username}'s profile picture`}
                width={200}
                height={200}
              />
              <span>{u.displayName}</span>
              <span>@{u.username}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export function NextButton({ isDisabled }: { isDisabled: boolean }) {
  return <button disabled={isDisabled}>Next</button>;
}

export function CloseMessagePageButton() {
  const router = useRouter();

  return (
    <div data-testid="close-message-page-button">
      <button
        onClick={() => {
          router.push('/messages');
        }}
      >
        Close
      </button>
    </div>
  );
}

type ChangeNotifier = (value: string) => void;

export function UserSearchInput({
  onThrottledChange: onChange,
  searchInputValue: value,
  setSearchInputValue: setValue,
}: {
  onThrottledChange: ChangeNotifier;
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
}) {
  useChange(onChange, value);

  return (
    <div data-testid="people-search">
      <input
        type="text"
        placeholder="Search people"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );

  function useChange(onChange: ChangeNotifier, value: string) {
    const throttler = useThrottler();

    useEffect(() => {
      const trimmed = trim(value);
      if (!isEmpty(trimmed)) throttler(() => onChange(trimmed), 350);

      function trim(value: string) {
        return value.trim();
      }

      function isEmpty(value: string) {
        return value.length === 0;
      }
    }, [value, throttler, onChange]);
  }

  function useThrottler() {
    const throttleSeed = useRef<null | NodeJS.Timeout>();

    const throttleFunction = useRef((func: () => void, delay = 200) => {
      if (!throttleSeed.current) {
        func();
        throttleSeed.current = setTimeout(() => {
          throttleSeed.current = null;
        }, delay);
      }
    });

    return throttleFunction.current;
  }
}
