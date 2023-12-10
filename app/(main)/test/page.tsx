import { Metadata } from 'next';
import React from 'react';
import { cookies } from 'next/headers';
import Hero from './hero';
import { promises as fs } from 'fs';

export const metadata: Metadata = {
  title: 'Test',
};

export default async function Page({}: {}) {
  const ascii =
    (await Promise.all(
      Array.from({ length: 937 }, (_, i) =>
        fs.readFile(process.cwd() + `/public/text/ascii_${i}.txt`, 'utf8'),
      ),
    )) ?? undefined;

  return (
    <main className="relative flex flex-col items-center gap-5 px-3 pb-10">
      {/* Header */}
      <header className="max-width flex items-center justify-between gap-40 pt-6 max-lg:justify-center">
        <div className="flex w-full flex-col gap-5 ">
          <div className="flex justify-between">
            <h1 className="text-[28px] font-semibold text-text-black max-lg:text-center"></h1>
          </div>
        </div>
      </header>

      <section className="max-width relative flex h-[424px] items-center gap-40 overflow-hidden rounded-[32px] border-[3px] border-[#E5E5E580] bg-[#195F9680] px-[84px] py-[56px] backdrop-blur max-lg:justify-center max-lg:px-[64px] max-lg:py-[56px] lg:justify-between">
        <Hero ascii={ascii} />
      </section>
    </main>
  );
}
