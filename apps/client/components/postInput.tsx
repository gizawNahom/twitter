import { useState } from 'react';
import { Post, createPost } from '../utilities/httpClient';

export function PostInput() {
  const [text, setText] = useState('');
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [post, setPost] = useState<Post>();

  return (
    <div>
      {isError && <div>Something went wrong</div>}
      <input
        placeholder="What's happening?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button disabled={isLoading || isInvalid(text)} onClick={sendRequest}>
        Post
      </button>
      {post && <p>Your post was sent.</p>}
    </div>
  );

  function isInvalid(text: string): boolean | undefined {
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

  async function sendRequest() {
    setLoading(true);
    const [post, errors] = await createPost(text);
    setLoading(false);
    if (errors) setError(true);
    else {
      setText('');
      setPost(post as Post);
    }
  }
}
