'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { PendingPathnameContext } from '../state/pathnameState';
import clsx from 'clsx';

export default function NavButton({
  className,
  name,
  href,
  onClick,
  ...props
}: {
  className?: string;
  name: string;
  href?: string;
  onClick?: () => void;
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
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
    <a
      key={name}
      href={href}
      className={clsx(className, {
        'animate-pulse': pendingPathname === href && !pathnameLoaded,
      })}
    >
      <button
        tabIndex={-1}
        className="flex h-full w-full items-center justify-center"
        onClick={() => (href ? setPendingPathname(href) : onClick?.())}
        disabled={pendingPathname === href && !pathnameLoaded}
        {...props}
      >
        <div className="block whitespace-nowrap">{name}</div>
      </button>
    </a>
  );
}
