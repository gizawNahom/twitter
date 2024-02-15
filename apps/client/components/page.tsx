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
    <div>
      <div className="flex justify-between gap-x-8 items-center pt-2 px-4">
        <BackButton />
        {title}
      </div>
      <div className={padded ? 'px-4' : ''}>{children}</div>
    </div>
  );
}
