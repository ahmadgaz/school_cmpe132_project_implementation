import { Metadata } from 'next';
import React from 'react';
import Form from '@/app/ui/profile/profile-form';
import api from '@/lib/api';
import { notFound } from 'next/navigation';
import { DeleteButton } from './buttons';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function Page() {
  const user = await api.fetchProfile();

  if (!user) {
    notFound();
  }

  return (
    <main className="relative flex flex-col items-center gap-5 px-3 pb-10">
      {/* Header */}
      <header className="max-width flex items-center justify-between gap-40 pt-6 max-lg:justify-center">
        <div className="flex w-full flex-col gap-5 ">
          <h1 className="text-text-black text-[28px] font-semibold max-lg:text-center">
            Profile
          </h1>
        </div>
      </header>

      {/* Form */}
      <section className="border-accent-light max-width flex flex-col items-center justify-between rounded-[32px] border-[1px] px-[42px] py-[28px]">
        <div className="flex w-full flex-col gap-6">
          <Form user={user} />
        </div>
        <DeleteButton id={user.id} />
      </section>
    </main>
  );
}
