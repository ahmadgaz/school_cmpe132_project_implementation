'use client';

import { UserType } from '@/lib/definitions';
import { usePathname } from 'next/navigation';
import { PendingPathnameContext } from '@/app/state/pathnameState';
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

export default function Result({
  user,
  href,
}: {
  user: UserType;
  href: string;
}) {
  const pathname = usePathname();
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
    <li className="border-accent-light flex h-fit min-h-[85px] items-center justify-between gap-4 border-t-[1px] pb-1 pr-6 pt-1">
      <Link
        href={href}
        onClick={() => setPendingPathname(href)}
        className={clsx(
          'animation hover:bg-primary-200 active:bg-primary-100 flex min-h-[70px] w-full items-center justify-start gap-1 rounded-xl px-6',
          {
            'text-primary-300 bg-primary-100 animate-pulse':
              pendingPathname === href && !pathnameLoaded,
          },
        )}
      >
        <hgroup className="flex h-fit flex-col gap-1 leading-3">
          <h1 className="text-text-black text-[24px] font-semibold leading-6">
            {user.username}
          </h1>
          {user.books && user.books.length > 1 && (
            <p className="text-text-gray text-[12px] font-semibold">
              Borrows {user.books.length} books
            </p>
          )}
          <p className="text-text-gray text-[10px] uppercase italic">
            {user.role}
          </p>
        </hgroup>
      </Link>
    </li>
  );
}
