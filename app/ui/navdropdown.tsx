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

  // On navigation, this allows navdropdown to wait for the new page to load before closing.
  // Haven't found a better way to do this yet.
  React.useEffect(() => {
    if (pendingPathname === pathname && isOpen) setIsOpen(false);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="button-secondary h-fit min-h-fit rounded-full border-0 px-0 py-0"
        >
          {!isOpen && <ChevronDownIcon className="h-8 w-8" />}
          {isOpen && <ChevronUpIcon className="h-8 w-8" />}
        </button>
      </div>
      {children}
    </div>
  );
}
