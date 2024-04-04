import { useEffect, useState } from 'react';

export function SearchInput({
  value = '',
  onSubmit,
}: {
  value?: string;
  onSubmit: (value: string) => void;
}) {
  const [query, setQuery] = useState('');

  useEffect(() => setQuery(value), [value]);

  return (
    <div data-testid="searchInput">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (isEnterKey(e.key) && !isEmpty(query)) onSubmit(query);

          function isEnterKey(key: string) {
            return key === 'Enter';
          }
        }}
      />
      {!isEmpty(query) && (
        <button aria-label="clear text" onClick={() => setQuery('')}></button>
      )}
    </div>
  );

  function isEmpty(query: string) {
    return query === '';
  }
}
