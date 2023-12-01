import PaginationButtons from '@/app/ui/pagination';
import api from '@/lib/api';

export default async function Pagination({ query }: { query: string }) {
  const totalPages = await api.fetchBooksPages(query);

  return (
    <div className="mt-5 flex w-full justify-center">
      <PaginationButtons totalPages={totalPages} />
    </div>
  );
}
