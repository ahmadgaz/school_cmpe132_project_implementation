'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { LoadingSpinner } from './skeletons';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const debouncedReplace = useDebouncedCallback(replace, 300);

  const params = new URLSearchParams(searchParams);
  const currentParam = params.get('query');
  const [pendingParam, setPendingParam] = React.useState(currentParam);

  function handleSearch(term: string) {
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    setPendingParam(params.get('query'));
    debouncedReplace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="input peer border-0 pl-10"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        {currentParam !== pendingParam ? <LoadingSpinner /> : ''}
      </span>
    </div>
  );
}
