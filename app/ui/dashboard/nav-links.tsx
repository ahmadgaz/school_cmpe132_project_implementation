'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React from 'react';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const fullPathname = usePathname();
  const pathname =
    '/' + fullPathname.split('/').filter(Boolean).slice(0, 2).join('/');
  const [pendingPathname, setPendingPathname] = React.useState('');

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const pathnameLoaded = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setPendingPathname(link.href)}
            className={clsx(
              'animation flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 active:text-blue-300 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'animate-pulse bg-sky-50 text-blue-300':
                  pendingPathname === link.href && !pathnameLoaded,
                'bg-sky-100 text-blue-600': pathnameLoaded,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
