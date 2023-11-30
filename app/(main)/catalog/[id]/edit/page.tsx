import { Metadata } from 'next';
import React from 'react';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/catalog/edit-form';
import { notFound } from 'next/navigation';
import read from '@/app/lib/read';

export const metadata: Metadata = {
  title: 'Edit Book',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const book = await read.fetchBook(id);

  if (!book) {
    notFound();
  }

  return (
    <main className="relative flex flex-col items-center gap-5 px-3 pb-10">
      {/* Header */}
      <header className="max-width flex items-center justify-between gap-40 pt-6 max-lg:justify-center">
        <div className="flex w-full flex-col gap-5 ">
          <h1 className="text-text-black text-[28px] font-semibold max-lg:text-center">
            <Breadcrumbs
              breadcrumbs={[
                { label: 'Catalog', href: '/catalog' },
                {
                  label: 'Add Book',
                  href: '/catalog/add',
                  active: true,
                },
              ]}
            />
          </h1>
        </div>
      </header>

      {/* Form */}
      <section className="border-accent-light max-width flex items-center justify-between gap-40 rounded-[32px] border-[1px] px-[42px] py-[28px]">
        <div className="flex w-full flex-col gap-6">
          <Form book={book} />
        </div>
      </section>
    </main>
  );
}
