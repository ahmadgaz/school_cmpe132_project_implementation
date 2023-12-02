import { Metadata } from 'next';
import React from 'react';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/users/add-form';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Add User',
};

export default async function Page() {
  const token = cookies().get('_session')?.value;
  return (
    <main className="relative flex flex-col items-center gap-5 px-3 pb-10">
      {/* Header */}
      <header className="max-width flex items-center justify-between gap-40 pt-6 max-lg:justify-center">
        <div className="flex w-full flex-col gap-5 ">
          <h1 className="text-[28px] font-semibold text-text-black max-lg:text-center">
            <Breadcrumbs
              breadcrumbs={[
                { label: 'Users', href: '/users' },
                {
                  label: 'Add User',
                  href: '/users/add',
                  active: true,
                },
              ]}
            />
          </h1>
        </div>
      </header>

      {/* Desktop */}
      <section className="max-width flex items-center justify-between gap-40 rounded-[32px] border-[1px] border-accent-light px-[42px] py-[28px] max-lg:hidden">
        <div className="flex w-full flex-col gap-6">
          <Form token={token} />
        </div>
      </section>

      {/* Mobile */}
      <div className="flex w-11/12 flex-col gap-6 lg:hidden">
        <Form token={token} />
      </div>
    </main>
  );
}
