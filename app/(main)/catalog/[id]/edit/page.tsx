import { Metadata } from 'next';
import React from 'react';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/catalog/edit-form';
import { notFound } from 'next/navigation';
import api from '@/lib/api';
import { DeleteButton } from '../../buttons';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Edit Book',
};

export default async function Page({ params }: { params: { id: string } }) {
  const token = cookies().get('_session')?.value;
  const id = params.id;
  const book = await api.fetchBook(id, token);

  if (!book) {
    notFound();
  }

  return (
    <main className="relative flex flex-col items-center gap-5 px-3 pb-10">
      {/* Header */}
      <header className="max-width flex items-center justify-between gap-40 pt-6 max-lg:justify-center">
        <div className="flex w-full flex-col gap-5 ">
          <h1 className="text-[28px] font-semibold text-text-black max-lg:text-center">
            <Breadcrumbs
              breadcrumbs={[
                { label: 'Catalog', href: '/catalog' },
                {
                  label: 'Edit Book',
                  href: `/catalog/${id}/edit`,
                  active: true,
                },
              ]}
            />
          </h1>
        </div>
      </header>

      {/* Desktop */}
      <section className="max-width flex flex-col items-center justify-between rounded-[32px] border-[1px] border-accent-light px-[42px] py-[28px] max-lg:hidden">
        <div className="flex w-full flex-col gap-6">
          <Form book={book} token={token} />
        </div>
        <DeleteButton id={id} token={token} />
      </section>

      {/* Mobile */}
      <div className="flex w-11/12 flex-col items-center">
        <div className="flex w-full flex-col gap-6 lg:hidden">
          <Form book={book} token={token} />
        </div>
        <DeleteButton id={id} token={token} />
      </div>
    </main>
  );
}
