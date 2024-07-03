import { ReactNode } from 'react';

export function FAB({ children }: { children: ReactNode }) {
  return (
    <figure className="bg-sky-400 w-14 h-14 rounded-full flex justify-center items-center shadow-lg active:bg-sky-700">
      {children}
    </figure>
  );
}
