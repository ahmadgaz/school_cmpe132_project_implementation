'use client';

import { BookType, UserType } from '@/app/lib/definitions';
import { deleteBook, saveRequest } from '@/app/lib/actions';
import React from 'react';
import { LoadingSpinner } from '@/app/ui/skeletons';
import { TrashIcon } from '@heroicons/react/24/outline';

/**
 * Button states:
 *
 * borrowerid == userid && requestid          REVOKE RETURN REQUEST
 * borrowerid != userid && requestid          NOT POSSIBLE
 * !borrowerid && requestid                   ANYONES REVOKE CHECK OUT REQUEST
 * borrowerid == userid && !requestid         RETURN
 * borrowerid != userid && !requestid         SOMEONE ELSES RETURN, ONLY ADMIN CAN SEE ALL
 * !borrowerid && !requestid                  REQUEST
 */

export function RequestButton({
  book,
  user,
}: {
  book: BookType;
  user?: UserType;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const handleClick = async () => {
    setLoading(true);
    setError('');
    try {
      await saveRequest(book);
    } catch (error) {
      console.error(error);
      setError((error as Error).message ?? 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const requested = book.requestid;
  const borrowed = book.borrowerid && !book.requestid;
  const available = !book.borrowerid && !book.requestid;
  const requestedReturn = book.borrowerid === user?.id && book.requestid;
  const requestedCheckout = !book.borrowerid && book.requestid;
  const borrowedByOtherUser =
    book.borrowerid && book.borrowerid !== user?.id && !book.requestid;
  const requestedByOtherUser =
    book.borrowerid && book.borrowerid !== user?.id && book.requestid;

  return (
    <>
      {user && (
        <div className="flex h-full flex-col items-end justify-center gap-1">
          {available && (
            <button
              onClick={handleClick}
              className="button-primary w-fit"
              disabled={Boolean(loading || requestedByOtherUser)}
              aria-disabled={Boolean(loading || requestedByOtherUser)}
            >
              {!loading && 'Request'} {loading && <LoadingSpinner />}
            </button>
          )}
          {requested && (
            <button
              onClick={handleClick}
              className="button-secondary w-fit"
              disabled={Boolean(loading || requestedByOtherUser)}
              aria-disabled={Boolean(loading || requestedByOtherUser)}
            >
              {!loading && 'Revoke'} {loading && <LoadingSpinner />}
            </button>
          )}
          {borrowed && (
            <button
              onClick={handleClick}
              className="button-tertiary w-fit"
              disabled={Boolean(loading || requestedByOtherUser)}
              aria-disabled={Boolean(loading || requestedByOtherUser)}
            >
              {!loading && 'Return'} {loading && <LoadingSpinner />}
            </button>
          )}

          {error && (
            <p className="text-danger-light whitespace-nowrap text-[12px] font-semibold italic">
              {error}
            </p>
          )}
          {!error && (
            <p className="text-text-gray whitespace-nowrap text-[12px] font-semibold italic">
              {requestedReturn
                ? 'Pending return approval...'
                : requestedCheckout
                ? 'Pending check out approval...'
                : borrowedByOtherUser
                ? `Borrowed by ${book.borrowername}.`
                : ''}
            </p>
          )}
        </div>
      )}
    </>
  );
}

export function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const handleClick = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteBook(id);
    } catch (error) {
      console.error(error);
      setError((error as Error).message ?? 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col items-end justify-center gap-1 pt-2">
        <button
          onClick={handleClick}
          className="text-danger-light animation flex w-fit items-center gap-2 font-semibold hover:underline hover:opacity-60"
          disabled={Boolean(loading)}
          aria-disabled={Boolean(loading)}
        >
          {loading && <LoadingSpinner />} <TrashIcon className="h-5 w-5" />{' '}
          {!loading && 'Delete book'}
        </button>

        {error && (
          <p className="text-danger-light whitespace-nowrap text-[12px] font-semibold italic">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
