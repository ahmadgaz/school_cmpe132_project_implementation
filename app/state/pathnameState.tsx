'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export const PendingPathnameContext = React.createContext<{
  pendingPathname: string;
  setPendingPathname: React.Dispatch<React.SetStateAction<string>>;
}>({
  pendingPathname: '',
  setPendingPathname: () => {},
});

export default function PathnameState({
  children,
}: {
  children: React.ReactNode;
}) {
  const fullPathname = usePathname();
  const pathname =
    '/' + fullPathname.split('/').filter(Boolean).slice(0, 2).join('/');
  const [pendingPathname, setPendingPathname] = React.useState(pathname);

  return (
    <PendingPathnameContext.Provider
      value={{ pendingPathname, setPendingPathname }}
    >
      {children}
    </PendingPathnameContext.Provider>
  );
}
