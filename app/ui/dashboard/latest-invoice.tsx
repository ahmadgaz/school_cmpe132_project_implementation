import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { LatestInvoiceType } from '@/app/lib/definitions';

export default async function LatestInvoice({
  invoice,
  i,
}: {
  invoice: LatestInvoiceType;
  i: number;
}) {
  return (
    <div
      className={clsx('flex flex-row items-center justify-between py-4', {
        'border-t': i !== 0,
      })}
    >
      <div className="flex items-center">
        <Image
          src={invoice.image_url}
          alt={`${invoice.name}'s profile picture`}
          className="mr-4 rounded-full"
          width={32}
          height={32}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcPn32fwAGYALKDm1W5gAAAABJRU5ErkJggg=="
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold md:text-base">
            {invoice.name}
          </p>
          <p className="hidden text-sm text-gray-500 sm:block">
            {invoice.email}
          </p>
        </div>
      </div>
      <p
        className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
      >
        {invoice.amount}
      </p>
    </div>
  );
}
