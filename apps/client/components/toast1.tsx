import { useEffect, useRef } from 'react';

export function Toast1() {
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
    <div
      className="pointer-events-auto mx-auto hidden w-96 max-w-full rounded-lg bg-white bg-clip-padding text-sm shadow-lg shadow-black/5 data-[te-toast-show]:block data-[te-toast-hide]:hidden dark:bg-neutral-600"
      id="static-example"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-te-autohide="false"
      ref={modalElementRef}
    >
      Post Created
    </div>
  );
}
