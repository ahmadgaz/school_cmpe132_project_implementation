'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { LoadingSpinner } from '../skeletons';
import { deleteInvoice } from '@/app/lib/actions';

export function CreateInvoice() {
  const pathname = usePathname();
  const [pendingPathname, setPendingPathname] = React.useState('');
  const pathnameLoaded = pathname === '/dashboard/invoices/create';

  return (
    <Link
      href="/dashboard/invoices/create"
      onClick={() => setPendingPathname('/dashboard/invoices/create')}
      className="animation relative flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>

      {pendingPathname === '/dashboard/invoices/create' && !pathnameLoaded ? (
        <span className="h-5 md:ml-4">
          <LoadingSpinner />
        </span>
      ) : (
        <PlusIcon className="h-5 md:ml-4" />
      )}
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
