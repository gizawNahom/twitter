import { useRouter } from 'next/router';
import { HOME_ROUTE } from '../utilities/constants';
import { ActionItem } from './actionItem';

export function BackButton({
  canGoBack = () => true,
}: {
  canGoBack?: () => boolean;
}) {
  const router = useRouter();

  return (
    <div data-testid="back-button">
      <button
        aria-label="back"
        onClick={() => {
          if (canGoBack()) {
            if (isFirstPageToBeLoaded()) router.push(HOME_ROUTE);
            else router.back();
          }
        }}
        className="flex items-center h-5 w-5 -ml-[0.2rem] p-0"
      >
        <ActionItem>
          <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            className=" w-5 h-5 fill-black"
          >
            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
            <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
          </svg>
        </ActionItem>
      </button>
    </div>
  );

  function isFirstPageToBeLoaded() {
    return window.history.length === 1;
  }
}
