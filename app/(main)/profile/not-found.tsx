import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Not Found',
};

export default function NotFound() {
  return (
    <main className="text-text-black flex h-screen flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="text-text-gray w-10" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested profile.</p>
      <Link href="/catalog" className="button-primary mt-4 w-fit">
        Go Back
      </Link>
    </main>
  );
}
