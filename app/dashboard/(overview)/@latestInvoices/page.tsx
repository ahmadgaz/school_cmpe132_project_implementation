import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import api from '../../../lib/data';

export default async function Page() {
  const latestInvoices = await api.fetchLatestInvoices();

  return <LatestInvoices latestInvoices={latestInvoices} />;
}
