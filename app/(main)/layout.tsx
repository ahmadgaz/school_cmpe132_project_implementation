import Navbar from '../ui/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-accent-light flex w-full justify-center border-b-[1px]">
        <Navbar />
      </header>
      <main className="min-h-[300px]">{children}</main>
      <footer></footer>
    </>
  );
}
