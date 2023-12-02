'use client';

import { suezOne } from './fonts';

export default function Logo() {
  return (
    <div
      className={`${suezOne.className} flex max-w-[303px] flex-row items-center leading-none max-lg:max-w-[250px]`}
    >
      <p className="logo-color p-[10px] text-[25px] tracking-tight max-lg:text-[20px] lg:leading-4">
        San José State University{' '}
        <span className="lg:text-[16px]">Library</span>
      </p>
    </div>
  );
}
