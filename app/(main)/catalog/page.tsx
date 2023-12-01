import Search from '@/app/ui/search';
import { TableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import React from 'react';
import Await from '@/lib/utils';
import { BookType, UserType } from '@/lib/definitions';
import api from '@/lib/api';
import Result from './result';
import Pagination from './pagination';
import PathnameState from '@/app/state/pathnameState';
import NavButton from '@/app/ui/navbutton';
import { cookies } from 'next/headers';

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
  const token = cookies().get('_session')?.value;
  const role = await api.fetchRole(token);
  const promise: Promise<{ books: BookType[]; user?: UserType }> =
    api.fetchCatalog(searchParams?.query, Number(searchParams?.page), token);
  return (
    <main className="relative flex flex-col items-center gap-5 px-3 pb-10">
      {/* Header */}
      <header className="max-width flex items-center justify-between gap-40 pt-6 max-lg:justify-center">
        <div className="flex w-full flex-col gap-5 ">
          <div className="flex justify-between">
            <h1 className="text-[28px] font-semibold text-text-black max-lg:text-center">
              Catalog
            </h1>
            {role === 'ADMIN' && (
              <PathnameState>
                <NavButton
                  className="button-primary w-fit"
                  name="Add Book"
                  href="/catalog/add"
                />
              </PathnameState>
            )}
          </div>
          <Search placeholder="Search catalog..." />
        </div>
      </header>

      {/* Results */}
      <section
        key={Math.random()}
        className="max-width flex items-center justify-between gap-40 rounded-[32px] border-[1px] border-accent-light px-[84px] py-[56px]"
      >
        <div className="flex w-full flex-col gap-6 border-b-[1px] border-accent-light max-lg:items-center">
          <React.Suspense fallback={<TableSkeleton />}>
            <Await promise={promise}>
              {(catalog) => (
                <ul>
                  <PathnameState>
                    {catalog?.books.map((book, i) => (
                      <Result
                        key={i}
                        href={`/catalog/${book.id}/edit`}
                        book={book}
                        user={catalog?.user}
                        token={token}
                        role={role}
                      />
                    ))}
                  </PathnameState>
                  {!catalog?.books.length && (
                    <li className="flex h-[85px] flex-col justify-center gap-1 pt-3">
                      <h1 className="h-8 text-center text-[24px] font-semibold italic text-text-gray">
                        Sorry, no books to show {':('}
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
        <Pagination query={searchParams?.query ?? ''} token={token} />
      </footer>
    </main>
  );
}
