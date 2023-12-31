import Search from '@/app/ui/search';
import { TableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import React from 'react';
import Await from '@/lib/utils';
import { LogType } from '@/lib/definitions';
import api from '@/lib/api';
import Result from './result';
import Pagination from './pagination';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Logs',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const token = cookies().get('_session')?.value;
  const promise: Promise<LogType[]> = api.fetchLogs(
    searchParams?.query,
    Number(searchParams?.page),
    token,
  );
  return (
    <main className="relative flex flex-col items-center gap-5 px-3 pb-10">
      {/* Header */}
      <header className="max-width flex items-center justify-between gap-40 pt-6 max-lg:justify-center">
        <div className="flex w-full flex-col gap-5 ">
          <div className="flex justify-between">
            <h1 className="text-[28px] font-semibold text-text-black max-lg:text-center">
              Logs
            </h1>
          </div>
          <Search placeholder="Search logs..." />
        </div>
      </header>

      {/* Desktop */}
      <section
        key={Math.random()}
        className="max-width flex items-center justify-between gap-40 rounded-[32px] border-[1px] border-accent-light px-[84px] py-[56px] max-lg:hidden"
      >
        <div className="flex w-full flex-col gap-6 border-b-[1px] border-accent-light max-lg:items-center">
          <React.Suspense fallback={<TableSkeleton />}>
            <Await promise={promise}>
              {(logs) => (
                <ul>
                  {logs?.map((log, i) => <Result key={i} log={log} />)}
                  {!logs?.length && (
                    <li className="flex h-fit flex-col justify-center gap-1 pt-3">
                      <h1 className="h-8 text-center text-[24px] font-semibold italic text-text-gray">
                        No logs.
                      </h1>
                    </li>
                  )}
                </ul>
              )}
            </Await>
          </React.Suspense>
        </div>
      </section>

      {/* Mobile */}
      <div className="flex w-full flex-col gap-6 border-b-[1px] border-accent-light max-lg:items-center lg:hidden">
        <React.Suspense fallback={<TableSkeleton />}>
          <Await promise={promise}>
            {(logs) => (
              <ul className="w-11/12">
                {logs?.map((log, i) => <Result key={i} log={log} />)}
                {!logs?.length && (
                  <li className="flex h-fit flex-col justify-center gap-1 pt-3">
                    <h1 className="h-8 text-center text-[24px] font-semibold italic text-text-gray">
                      No logs.
                    </h1>
                  </li>
                )}
              </ul>
            )}
          </Await>
        </React.Suspense>
      </div>

      {/* Pagination */}
      <footer className="max-width flex items-center justify-center max-lg:justify-center">
        <Pagination query={searchParams?.query ?? ''} token={token} />
      </footer>
    </main>
  );
}
