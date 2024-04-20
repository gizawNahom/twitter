import { useRouter } from 'next/router';
import { HOME_ROUTE } from '../utilities/constants';

export function BackButton() {
  const router = useRouter();

  return (
    <div data-testid="back-button">
      <button
        aria-label="back"
        onClick={() => {
          if (isFirstPageToBeLoaded()) router.push(HOME_ROUTE);
          else router.back();
        }}
        className="flex items-center h-5 w-5 -ml-[0.2rem] p-0 relative before:block before:absolute before:hover:bg-slate-200 before:active:bg-slate-300 before:w-full before:h-full before:-z-10 before:rounded-full before:p-4 before:-top-[6px] before:-left-[6px]"
      >
        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          className=" w-5 h-5 fill-black"
        >
          <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
          <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
        </svg>
      </button>
    </div>
  );

  function isFirstPageToBeLoaded() {
    return window.history.length === 1;
  }
}
