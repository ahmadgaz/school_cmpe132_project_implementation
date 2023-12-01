'use client';

import { RequestType } from '@/lib/definitions';
import { acceptRequest, denyRequest } from '@/lib/actions';
import React from 'react';
import { LoadingSpinner } from '@/app/ui/skeletons';

export function AcceptButton({
  request,
  token,
}: {
  request: RequestType;
  token?: string;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const handleClick = async () => {
    setLoading(true);
    setError('');
    try {
      await acceptRequest(request, token);
    } catch (error) {
      console.error(error);
      setError((error as Error).message ?? 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col items-end justify-center gap-1">
        <button
          onClick={handleClick}
          className="button-tertiary w-fit"
          disabled={Boolean(loading)}
          aria-disabled={Boolean(loading)}
        >
          {!loading && 'Accept'} {loading && <LoadingSpinner />}
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

export function DenyButton({
  request,
  token,
}: {
  request: RequestType;
  token?: string;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const handleClick = async () => {
    setLoading(true);
    setError('');
    try {
      await denyRequest(request, token);
    } catch (error) {
      console.error(error);
      setError((error as Error).message ?? 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col items-end justify-center gap-1">
        <button
          onClick={handleClick}
          className="button-danger w-fit"
          disabled={Boolean(loading)}
          aria-disabled={Boolean(loading)}
        >
          {!loading && 'Deny'} {loading && <LoadingSpinner />}
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
