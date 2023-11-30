import PaginationButtons from '@/app/ui/pagination';
import read from '@/app/lib/read';

export default async function Pagination({ query }: { query: string }) {
  const totalPages = await read.fetchBooksPages(query);

  return (
    <div className="mt-5 flex w-full justify-center">
      <PaginationButtons totalPages={totalPages} />
    </div>
  );
}
