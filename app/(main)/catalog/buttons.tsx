'use client';

import { BookType, UserType } from '@/app/lib/definitions';
import { saveRequest } from '@/app/lib/actions';
import React from 'react';
import { LoadingSpinner } from '@/app/ui/skeletons';

/**
 * Button states:
 *
 * borrowerid == userid && requestid          REVOKE RETURN REQUEST
 * borrowerid != userid && requestid          NOT POSSIBLE
 * !borrowerid && requestid                   REVOKE CHECK OUT REQUEST
 * borrowerid == userid && !requestid         RETURN
 * borrowerid != userid && !requestid         SOMEONE ELSES RETURN, ONLY ADMIN CAN SEE
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
