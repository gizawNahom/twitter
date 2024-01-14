import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  createPostAsync,
  selectCreateStatus,
} from '../lib/redux/slices/postsSlice';
import { useDispatch } from '../lib/redux';

export function PostForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const dispatch = useDispatch();
  const status = useSelector(selectCreateStatus);

  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (isSucceeded(status)) setText('');
  }, [status, setText]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className="p-3 border-b-[1px]" data-testid="post-input">
      {status === 'failed' && <div>Something went wrong</div>}
      <div className=" flex flex-col gap-3">
        <input
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-10 text-xl placeholder:text-slate-600 pb-6 border-b-transparent border-b-[1px] transition focus:outline-transparent focus:border-b-sky-400"
          ref={inputRef}
        />
        <button
          disabled={
            isInvalid(text) || status === 'loading' || isSucceeded(status)
          }
          onClick={() => {
            dispatch(createPostAsync(text));
          }}
          className=" w-min bg-sky-500 self-end px-4 py-1 rounded-full text-white font-semibold"
        >
          Post
        </button>
      </div>
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
