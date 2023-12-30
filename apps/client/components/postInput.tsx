import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createPostAsync, selectStatus } from '../lib/redux/slices/postSlice';
import { useDispatch } from '../lib/redux';

export function PostInput() {
  const dispatch = useDispatch();

  const status = useSelector(selectStatus);

  const [text, setText] = useState('');

  useEffect(() => {
    if (isSucceeded(status)) setText('');
  }, [status, setText]);

  return (
    <div>
      {status === 'failed' && <div>Something went wrong</div>}
      <input
        placeholder="What's happening?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        disabled={
          isInvalid(text) || status === 'loading' || isSucceeded(status)
        }
        onClick={() => {
          dispatch(createPostAsync(text));
        }}
      >
        Post
      </button>
      {status === 'succeeded' && <p>Your post was sent.</p>}
    </div>
  );

  function isSucceeded(status: string): boolean {
    return status === 'succeeded';
  }

  function isInvalid(text: string): boolean {
    if (isEmpty(text) || isLongerThan280(text) || isMadeUpOfWhiteSpace(text))
      return true;
    else return false;

    function isEmpty(text: string) {
      return text === '';
    }

    function isLongerThan280(text: string): boolean {
      return text.length > 280;
    }

    function isMadeUpOfWhiteSpace(text: string): boolean {
      return text.trim().length === 0;
    }
  }
}
