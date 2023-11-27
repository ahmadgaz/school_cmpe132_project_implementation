import { CardSkeleton } from '@/app/ui/skeletons';

export default function Loading() {
  return (
    <>
      <div className="relative mb-4 h-8 w-36 animate-pulse overflow-hidden rounded-md bg-gray-100" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </>
  );
}
