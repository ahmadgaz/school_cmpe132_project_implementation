import { lusitana } from '@/app/ui/fonts';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import Search from '@/app/ui/search';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices',
};

export default function Layout({
  resultsTable,
  pagination,
}: {
  resultsTable: React.ReactNode;
  pagination: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      {resultsTable}
      {pagination}
    </main>
  );
}
