import { ReactNode } from 'react';
import { Nav } from './nav';
import { PostFAB } from './postFAB';

export function App({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Nav></Nav>
      <div className="grow lg:basis-1/2">{children}</div>
      <div className="sm:hidden absolute bottom-16 right-5">
        <PostFAB />
      </div>
    </div>
  );
}
