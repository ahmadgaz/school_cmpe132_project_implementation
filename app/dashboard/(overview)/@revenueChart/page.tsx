import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import api from '../../../lib/data';

export default async function Page() {
  const revenue = await api.fetchRevenue();

  return <RevenueChart revenue={revenue} />;
}
