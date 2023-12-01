import PaginationButtons from '@/app/ui/pagination';
import api from '@/lib/api';

export default async function Pagination({
  id,
  query,
  token,
}: {
  id: string;
  query: string;
  token?: string;
}) {
  const totalPages = await api.fetchUserBooksPages(id, query, token);

  return (
    <div className="mt-5 flex w-full justify-center">
      <PaginationButtons totalPages={totalPages} />
    </div>
  );
}
