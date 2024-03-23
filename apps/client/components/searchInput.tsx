import { useRouter } from 'next/router';
import { useState } from 'react';

export function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (isEnterKey(e.key) && !isEmpty(query)) pushToSearchPage();

          function isEnterKey(key: string) {
            return key === 'Enter';
          }

          function pushToSearchPage() {
            router.push('/search');
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
