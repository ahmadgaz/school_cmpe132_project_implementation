'use client';

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import React from 'react';
import Logo from './logo';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { PendingPathnameContext } from '../state/pathnameState';

export default function NavDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const fullPathname = usePathname();
  const pathname =
    '/' + fullPathname.split('/').filter(Boolean).slice(0, 2).join('/');
  const { pendingPathname } = React.useContext(PendingPathnameContext);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    console.log(isOpen, pendingPathname, pathname);
    if (pendingPathname === pathname && isOpen) setIsOpen(false);
  }, [pathname]);

  return (
    <div
      className={`animation flex flex-col items-center gap-4 border-x-[1px] px-4
      ${
        isOpen
          ? 'h-screen overflow-y-scroll border-accent-light '
          : 'h-[60px] overflow-hidden border-transparent'
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <Link className="min-h-[50px] w-fit" href="/">
          <Logo />
        </Link>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="button-secondary h-fit min-h-fit px-0 py-0"
          >
            <ChevronDownIcon className="h-8 w-8" />
          </button>
        )}
        {isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="button-secondary h-fit min-h-fit px-0 py-0"
          >
            <ChevronUpIcon className="h-8 w-8" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
