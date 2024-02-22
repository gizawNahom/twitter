import { ReactNode } from 'react';
import { Nav } from './nav';

export function App({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Nav></Nav>
      <div className="grow sm:max-w-xl sm:border-r-[1px]">{children}</div>
    </div>
  );
}
