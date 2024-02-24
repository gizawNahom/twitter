import { useEffect, useRef } from 'react';

export function Toast() {
  const modalElementRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modalRef = useRef<any>();

  useEffect(() => {
    const init = async () => {
      const { Toast } = await import('tw-elements');
      const toast = new Toast(modalElementRef.current);
      modalRef.current = toast;
    };
    init();
    return () => modalRef.current?.dispose();
  }, []);

  return (
    <div>
      <button
        aria-label="open"
        onClick={() => {
          modalRef.current.show();
        }}
        className=" bg-slate-400"
      >
        open
      </button>
      <div
        className="pointer-events-auto mx-auto hidden w-96 max-w-full rounded-lg bg-white bg-clip-padding text-sm shadow-lg shadow-black/5 data-[te-toast-show]:block data-[te-toast-hide]:hidden dark:bg-neutral-600"
        id="static-example"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-te-autohide="false"
        ref={modalElementRef}
      >
        <div className="flex items-center justify-between rounded-t-lg border-b-2 border-neutral-100 border-opacity-100 bg-white bg-clip-padding px-4 pb-2 pt-2.5 dark:border-opacity-50 dark:bg-neutral-600">
          <p className="font-bold text-neutral-500 dark:text-neutral-200">
            MDBootstrap
          </p>
          <div className="flex items-center">
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              11 mins ago
            </p>
            <button
              type="button"
              className="ml-2 box-content rounded-none border-none opacity-80 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              data-te-toast-dismiss
              aria-label="Close"
              onClick={() => {
                modalRef.current?.hide();
              }}
            >
              <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div className="break-words rounded-b-lg bg-white px-4 py-4 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200">
          Static Example
        </div>
      </div>
    </div>
  );
}
