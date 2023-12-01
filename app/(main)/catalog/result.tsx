'use client';

import { BookType, UserType } from '@/lib/definitions';
import { RequestButton } from './buttons';
import { usePathname } from 'next/navigation';
import { PendingPathnameContext } from '@/app/state/pathnameState';
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

export default function Result({
  book,
  user,
  href,
  token,
  role,
}: {
  book: BookType;
  user?: UserType;
  href: string;
  token?: string;
  role?: string;
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
    <li className="flex h-fit min-h-[85px] items-center justify-between gap-4 border-t-[1px] border-accent-light pb-1 pr-6 pt-1">
      {role !== 'ADMIN' && (
        <hgroup className="flex h-fit flex-col gap-1 px-6">
          <h1 className="text-[24px] font-semibold leading-6 text-text-black">
            {book.title}
          </h1>
          <p className="text-[12px] font-semibold text-text-gray">
            by {book.author}
          </p>
        </hgroup>
      )}
      {role === 'ADMIN' && (
        <Link
          href={href}
          onClick={() => setPendingPathname(href)}
          className={clsx(
            'animation flex min-h-[70px] w-full items-center justify-start gap-1 rounded-xl px-6 hover:bg-primary-200 active:bg-primary-100',
            {
              'animate-pulse bg-primary-100 text-primary-300':
                pendingPathname === href && !pathnameLoaded,
            },
          )}
        >
          <hgroup className="flex h-fit flex-col gap-1">
            <h1 className="text-[24px] font-semibold leading-6 text-text-black">
              {book.title}
            </h1>
            <p className="text-[12px] font-semibold text-text-gray">
              by {book.author}
            </p>
          </hgroup>
        </Link>
      )}
      <RequestButton book={book} user={user} token={token} />
    </li>
  );
}
