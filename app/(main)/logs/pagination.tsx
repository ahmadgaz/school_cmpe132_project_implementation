import PaginationButtons from '@/app/ui/pagination';
import api from '@/app/lib/api';

export default async function Pagination({ query }: { query: string }) {
  const totalPages = await api.fetchLogsPages(query);

  return (
    <div className="mt-5 flex w-full justify-center">
      <PaginationButtons totalPages={totalPages} />
    </div>
  );
}
