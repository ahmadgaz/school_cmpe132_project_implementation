'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-screen max-h-[300px] flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button className="button-primary mt-4 w-fit" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
