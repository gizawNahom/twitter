import { ReactNode } from 'react';
import { BackButton } from './backButton';

export function Page({
  children,
  title,
  padded = true,
}: {
  children: ReactNode;
  title?: ReactNode;
  padded?: boolean;
}) {
  return (
    <div className="flex flex-col gap-y-2 pt-4">
      <div className="flex justify-between items-center gap-x-9 px-4">
        <BackButton />
        <div className="grow">{title}</div>
      </div>
      <div className={padded ? 'px-4' : ''}>{children}</div>
    </div>
  );
}
