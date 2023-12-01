'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React from 'react';
import { PendingPathnameContext } from '../state/pathnameState';

export default function NavLink({
  name,
  href,
}: {
  name: string;
  href: string;
}) {
  const fullPathname = usePathname();
  const pathname =
    '/' + fullPathname.split('/').filter(Boolean).slice(0, 2).join('/');
  const pathnameLoaded = pathname === href;
  const { pendingPathname, setPendingPathname } = React.useContext(
    PendingPathnameContext,
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (pendingPathname === href) {
        setPendingPathname(pathname);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [href, pendingPathname, pathname, setPendingPathname]);

  return (
    <Link
      key={name}
      href={href}
      onClick={() => setPendingPathname(href)}
      className={clsx(
        'animation flex h-full grow items-center justify-center border-b-[3px] px-2 text-[16px] font-bold',
        {
          'border-primary-900': pathnameLoaded,
          'border-transparent': !pathnameLoaded,
        },
      )}
    >
      <p
        className={clsx(
          'animation text-text-black hover:bg-primary-200 hover:text-primary-900 active:text-primary-300 block rounded-lg px-3 py-1',
          {
            'text-primary-300 bg-primary-100 animate-pulse':
              pendingPathname === href && !pathnameLoaded,
          },
        )}
      >
        {name}
      </p>
    </Link>
  );
}
