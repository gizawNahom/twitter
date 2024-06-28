import { useRouter } from 'next/router';
import { Page } from '../../components/page';
import { useEffect, useRef, useState } from 'react';

export default function ComposeMessage() {
  return (
    <Page
      title={
        <div>
          <CloseMessagePageButton />
          New message
          <button disabled>Next</button>
        </div>
      }
    >
      <PeopleSearch onChange={(value) => console.log(value)} />
    </Page>
  );
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

export function PeopleSearch({ onChange }: { onChange: ChangeNotifier }) {
  const { value, setValue } = useChange(onChange);

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

  function useChange(onChange: ChangeNotifier) {
    const [value, setValue] = useState('');

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

    return { value, setValue };
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
