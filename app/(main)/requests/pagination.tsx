import PaginationButtons from '@/app/ui/pagination';
import api from '@/lib/api';

export default async function Pagination({
  query,
  token,
}: {
  query: string;
  token?: string;
}) {
  const totalPages = await api.fetchRequestsPages(query, token);

  return (
    <div className="mt-5 flex w-full justify-center">
      <PaginationButtons totalPages={totalPages} />
    </div>
  );
}
