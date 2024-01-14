import { ReactNode } from 'react';
import { BackButton } from './backButton';

export function Page({
  children,
  title,
}: {
  children: ReactNode;
  title?: ReactNode;
}) {
  return (
    <div className="px-4">
      <div className="flex justify-between gap-x-8 items-center pt-2">
        <BackButton />
        {title}
      </div>
      {children}
    </div>
  );
}
