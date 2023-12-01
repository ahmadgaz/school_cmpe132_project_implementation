'use client';

import { deleteUser } from '@/lib/actions';
import React from 'react';
import { LoadingSpinner } from '@/app/ui/skeletons';
import { TrashIcon } from '@heroicons/react/24/outline';

export function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const handleClick = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteUser(id);
    } catch (error) {
      console.error(error);
      setError(String(error) || 'Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col items-center justify-center gap-1 pt-2">
        <button
          onClick={handleClick}
          className="text-danger-light animation flex w-fit items-center gap-2 font-semibold hover:underline hover:opacity-60"
          disabled={Boolean(loading)}
          aria-disabled={Boolean(loading)}
        >
          {loading && <LoadingSpinner />} <TrashIcon className="h-5 w-5" />{' '}
          {!loading && 'Delete Profile'}
        </button>

        <p className="text-danger-light whitespace-nowrap text-[12px] font-semibold italic">
          {error}
        </p>
      </div>
    </>
  );
}
