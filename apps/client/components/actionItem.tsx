import { ReactNode } from 'react';

export function ActionItem({ children }: { children: ReactNode }) {
  return (
    <div className="relative before:transition before:block before:absolute before:hover:bg-slate-200 before:active:bg-slate-300 before:w-full before:h-full before:-z-10 before:rounded-full before:p-4 before:-top-[6px] before:-left-[6px]">
      {children}
    </div>
  );
}
