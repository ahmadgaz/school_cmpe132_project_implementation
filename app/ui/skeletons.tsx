export const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="h-5 w-5 ">
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75 "
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <li className="border-accent-light flex h-[85px] animate-pulse flex-col gap-2 border-t-[1px] pt-3">
      <div className="text-text-black bg-accent-light h-8 max-w-[250px] rounded-lg text-[24px] font-semibold" />
      <div className="text-text-gray bg-accent-light h-4 max-w-[150px] rounded-md text-[12px] font-semibold" />
    </li>
  );
}

export function TableSkeleton() {
  return (
    <ul className="w-full">
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
    </ul>
  );
}
