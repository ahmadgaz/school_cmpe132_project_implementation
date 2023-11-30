import Search from '@/app/ui/search';
import { TableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import React from 'react';
import Await from '@/app/lib/utils';
import { cookies } from 'next/headers';
import { BookType } from '@/app/lib/definitions';
import read from '@/app/lib/read';
import Results from './results';
import Pagination from './pagination';

export const metadata: Metadata = {
  title: 'Catalog',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  console.log('page: ', searchParams?.page);
  const promise: Promise<BookType[]> = read.fetchBooks(
    searchParams?.query,
    Number(searchParams?.page),
  );
  return (
    <main className="relative flex flex-col items-center gap-5 px-3">
      {/* Header */}
      <header className="max-width flex items-center justify-between gap-40 pt-6 max-lg:justify-center">
        <div className="flex w-full flex-col gap-5 ">
          <h1 className="text-text-black text-[28px] font-semibold max-lg:text-center">
            Catalog
          </h1>
          <Search placeholder="Search catalog..." />
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
              {(books) => <Results books={books} />}
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
