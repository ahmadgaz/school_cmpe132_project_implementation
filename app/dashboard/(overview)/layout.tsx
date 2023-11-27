export default function Layout({
  cards,
  revenueChart,
  latestInvoices,
}: {
  cards: React.ReactNode;
  revenueChart: React.ReactNode;
  latestInvoices: React.ReactNode;
}) {
  return (
    <main>
      {cards}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {revenueChart}
        {latestInvoices}
      </div>
    </main>
  );
}
