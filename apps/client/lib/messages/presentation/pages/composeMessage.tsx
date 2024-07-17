import Image from 'next/image';
import { useRouter } from 'next/router';
import { Page } from '../../../../components/page';
import { useEffect, useRef, useState } from 'react';
import { User, getUsers } from '../../../../../client/utilities/getUsers';
import { Error } from '../../../../components/error';
import {
  MESSAGES_CHAT_ROUTE,
  MESSAGES_ROUTE,
} from '../../../../lib/messages/routes';
import { useDispatch } from 'react-redux';
import { userSelected } from '../../../../lib/redux';

export default function ComposeMessage() {
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'selected'
  >();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Page header={renderHeader()} isPadded>
      <div className="pb-2 pt-4">
        <UserSearchInput
          onThrottledChange={onChange}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
        />
      </div>
      {selectedUser && renderSelectedUser(selectedUser)}
      <hr className="border-slate-300 absolute left-0 w-full" />
      {status == 'loading' && renderProgressBar()}
      {status == 'success' && renderMatchingUsers(users)}
      {status == 'error' && <Error />}
    </Page>
  );

  function renderHeader() {
    return (
      <div className="flex justify-between items-center gap-x-9">
        <div className="flex gap-x-10 items-center">
          <CloseMessagePageButton />
          <h1 className=" font-semibold">New message</h1>
        </div>
        {renderNextButton(selectedUser ? false : true)}
      </div>
    );
  }

  function renderNextButton(isDisabled: boolean) {
    return (
      <button
        disabled={isDisabled}
        className={`px-4 py-1 text-white rounded-full transition text-sm font-bold ${
          isDisabled ? 'bg-gray-400' : 'bg-black'
        }`}
        onClick={() => {
          dispatch(userSelected(selectedUser as User));
          router.push(MESSAGES_CHAT_ROUTE);
        }}
      >
        Next
      </button>
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
      <ul className="flex flex-col pt-4">
        {users.map((u, i) => {
          return (
            <li
              key={i}
              onClick={() => {
                setSelectedUser(u);
                setSearchInputValue('');
                setStatus('selected');
              }}
              className="flex gap-x-2 items-center cursor-pointer py-4"
            >
              <div className="w-10 h-10 relative rounded-full overflow-hidden">
                <Image
                  src={u.profilePic}
                  alt={`${u.username}'s profile picture`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold">{u.displayName}</h2>
                <p className=" text-sm text-gray-500">@{u.username}</p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}

export function CloseMessagePageButton() {
  const router = useRouter();

  return (
    <div data-testid="close-message-page-button" className=" flex items-center">
      <button
        onClick={() => {
          router.push(MESSAGES_ROUTE);
        }}
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className=" w-5 h-5">
          <g>
            <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
          </g>
        </svg>
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
  const [isFocused, setIsFocused] = useState(false);
  useChange(onChange, value);

  return (
    <div data-testid="people-search">
      <div className=" flex gap-x-5 items-center pl-[0.20rem]">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`w-5 h-5 transition ${
            isFocused ? 'fill-cyan-500' : 'fill-slate-500'
          }`}
        >
          <g>
            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
          </g>
        </svg>
        <input
          type="text"
          placeholder="Search people"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className=" w-full outline-none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
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
