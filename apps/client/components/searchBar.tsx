import { KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react';

export function SearchBar({
  value = '',
  onSubmit,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFocusChange = () => {},
}: {
  value?: string;
  onSubmit: (value: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(value);
  const { focused } = useFocused(inputRef);

  useEffect(() => {
    onFocusChange(focused);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      data-testid="searchBar"
      className={`rounded-full pl-4 pr-2 border-[0.5px] transition flex gap-x-3 items-center justify-between ${
        focused
          ? `border-cyan-400 bg-inherit`
          : `border-transparent bg-slate-100`
      } sm:py-2 sm:pr-3`}
    >
      <div className=" flex items-center gap-x-3 grow sm:gap-x-5">
        {renderIcon()}
        {renderInput()}
      </div>
      <div className="w-5 h-6">
        {canRenderClearTextButton() && renderClearTextButton()}
      </div>
    </div>
  );

  function useFocused(inputRef: RefObject<HTMLElement>) {
    const [focused, setFocused] = useState(false);

    useEffect(() => {
      const handleFocus = () => {
        setFocused(true);
        onFocusChange(true);
      };

      const handleBlur = () => {
        setFocused(false);
        onFocusChange(false);
      };

      const currentInput = inputRef.current;
      currentInput?.addEventListener('focus', handleFocus);
      currentInput?.addEventListener('blur', handleBlur);

      return () => {
        currentInput?.removeEventListener('focus', handleFocus);
        currentInput?.removeEventListener('blur', handleBlur);
      };
    }, [inputRef]);

    return { focused };
  }

  function renderIcon() {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`w-4 h-4 transition ${
          focused ? `fill-cyan-500` : `fill-slate-600`
        } sm:w-5 sm:h-5`}
      >
        <g>
          <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
        </g>
      </svg>
    );
  }

  function renderInput() {
    return (
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        className="outline-none bg-inherit w-full"
        ref={inputRef}
      />
    );

    function onKeyDown(e: KeyboardEvent) {
      if (isEnterKey(e.key) && !isEmpty(query)) onSubmit(query);

      function isEnterKey(key: string) {
        return key === 'Enter';
      }
    }
  }

  function canRenderClearTextButton() {
    return !isEmpty(query);
  }

  function isEmpty(query: string) {
    return query === '';
  }

  function renderClearTextButton() {
    return (
      <button
        aria-label="clear text"
        onClick={() => {
          inputRef.current?.focus();
          setQuery('');
        }}
        className=" bg-blue-500 rounded-full p-1"
      >
        <svg
          viewBox="0 0 15 15"
          aria-hidden="true"
          className="w-2 h-2 transition fill-white sm:w-3 sm:h-3"
        >
          <g>
            <path d="M6.09 7.5L.04 1.46 1.46.04 7.5 6.09 13.54.04l1.42 1.42L8.91 7.5l6.05 6.04-1.42 1.42L7.5 8.91l-6.04 6.05-1.42-1.42L6.09 7.5z"></path>
          </g>
        </svg>
      </button>
    );
  }
}
