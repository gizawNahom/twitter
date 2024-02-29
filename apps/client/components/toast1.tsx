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
      modalRef.current.show();
    };
    init();
    return () => modalRef.current?.dispose();
  }, []);

  return (
    <div
      className="absolute inset-x-0 bottom-[53px] hidden pointer-events-auto text-white text-xs bg-sky-500 bg-clip-padding shadow-lg shadow-black/5 data-[te-toast-show]:block data-[te-toast-hide]:hidden max-w-full px-3 py-2 mx-auto sm:w-max sm:rounded-sm"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-te-autohide="true"
      ref={modalElementRef}
    >
      Post Created.
    </div>
  );
}
