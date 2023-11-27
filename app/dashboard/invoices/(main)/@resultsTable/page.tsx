import Table from '@/app/ui/invoices/table';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return <Table query={query} currentPage={currentPage} />;
}
