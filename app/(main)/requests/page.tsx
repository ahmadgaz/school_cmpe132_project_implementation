import Search from '@/app/ui/search';
import { TableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import React from 'react';
import Await from '@/app/lib/utils';
import { RequestType } from '@/app/lib/definitions';
import api from '@/app/lib/api';
import Result from './result';
import Pagination from './pagination';

export const metadata: Metadata = {
  title: 'Requests',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const promise: Promise<RequestType[]> = api.fetchRequests(
    searchParams?.query,
    Number(searchParams?.page),
  );
  return (
    <main className="relative flex flex-col items-center gap-5 px-3 pb-10">
      {/* Header */}
      <header className="max-width flex items-center justify-between gap-40 pt-6 max-lg:justify-center">
        <div className="flex w-full flex-col gap-5 ">
          <div className="flex justify-between">
            <h1 className="text-text-black text-[28px] font-semibold max-lg:text-center">
              Requests
            </h1>
          </div>
          <Search placeholder="Search requests..." />
        </div>
      </header>

      {/* Results */}
      <section
        key={Math.random()}
        className="border-accent-light max-width flex items-center justify-between gap-40 rounded-[32px] border-[1px] px-[84px] py-[56px]"
      >
        <div className="border-accent-light flex w-full flex-col gap-6 border-b-[1px] max-lg:items-center">
          <React.Suspense fallback={<TableSkeleton />}>
            <Await promise={promise}>
              {(requests) => (
                <ul>
                  {requests?.map((request, i) => (
                    <Result key={i} request={request} />
                  ))}
                  {!requests.length && (
                    <li className="flex h-[85px] flex-col justify-center gap-1 pt-3">
                      <h1 className="text-text-gray h-8 text-center text-[24px] font-semibold italic">
                        No requests.
                      </h1>
                    </li>
                  )}
                </ul>
              )}
            </Await>
          </React.Suspense>
        </div>
      </section>

      {/* Pagination */}
      <footer className="max-width flex items-center justify-center max-lg:justify-center">
        <Pagination query={searchParams?.query ?? ''} />
      </footer>
    </main>
  );
}
