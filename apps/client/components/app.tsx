import { ReactNode } from 'react';
import { Nav } from './nav';

export function App({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Nav></Nav>
      <div className="grow lg:basis-1/2">{children}</div>
    </div>
  );
}
