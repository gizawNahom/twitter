import { ReactNode } from 'react';
import { BackButton } from './backButton';

export function Page({
  children,
  header = createDefaultHeader(),
  isPadded: isPadded = true,
}: {
  children: ReactNode;
  header?: ReactNode;
  isPadded?: boolean;
}) {
  return (
    <div className="flex flex-col gap-y-2 pt-4 relative">
      <div className="px-4">{header}</div>
      <div className={isPadded ? 'px-4' : ''}>{children}</div>
    </div>
  );
}

export function createDefaultHeader(title?: ReactNode) {
  return (
    <div className="flex justify-between items-center gap-x-9">
      <BackButton />
      <div className="grow">{title}</div>
    </div>
  );
}

export function Page1({
  children,
  header = createDefaultHeader1(),
  isPadded: isPadded = true,
}: {
  children: ReactNode;
  header?: ReactNode;
  isPadded?: boolean;
}) {
  return (
    <div className="relative h-screen max-h-screen min-h-screen pt-1">
      <div className="px-4 h-[6%] w-full pb-1">{header}</div>
      <div className={`h-[94%] w-full ${isPadded ? 'px-4' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export function createDefaultHeader1(title?: ReactNode) {
  return (
    <div className="flex justify-between items-center gap-x-9 h-full">
      <BackButton />
      <div className="grow">{title}</div>
    </div>
  );
}
