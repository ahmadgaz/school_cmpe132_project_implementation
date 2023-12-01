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
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { notFound } from 'next/navigation';
import { DeleteButton } from './buttons';

export const metadata: Metadata = {
  title: 'User',
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const id = params.id;
  const user = await api.fetchUserById(id);

  if (!user) {
    notFound();
  }

  const promise: Promise<{ books: BookType[] }> = api.fetchUserBooks(
    id,
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
              <Breadcrumbs
                breadcrumbs={[
                  { label: 'Users', href: '/users' },
                  {
                    label: `${user.username}'s Books`,
                    href: `/users/${id}/edit`,
                    active: true,
                  },
                ]}
              />
            </h1>
          </div>
          <Search placeholder="Search books..." />
        </div>
      </header>

      {/* Results */}
      <section
        key={Math.random()}
        className="border-accent-light  max-width  flex flex-col items-center justify-between gap-5 rounded-[32px] border-[1px] px-[84px] pb-7 pt-[56px]"
      >
        <div className="border-accent-light flex w-full flex-col  gap-6 border-b-[1px] max-lg:items-center">
          <React.Suspense fallback={<TableSkeleton />}>
            <Await promise={promise}>
              {(books) => (
                <ul>
                  {books?.books.map((book, i) => (
                    <Result key={i} book={book} user={user} />
                  ))}
                  {!books?.books.length && (
                    <li className="flex h-[85px] flex-col justify-center gap-1 pt-3">
                      <h1 className="text-text-gray h-8 text-center text-[24px] font-semibold italic">
                        No books.
                      </h1>
                    </li>
                  )}
                </ul>
              )}
            </Await>
          </React.Suspense>
        </div>
        <DeleteButton id={id} />
      </section>

      {/* Pagination */}
      <footer className="max-width flex items-center justify-center max-lg:justify-center">
        <Pagination id={id} query={searchParams?.query ?? ''} />
      </footer>
    </main>
  );
}
