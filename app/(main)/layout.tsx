import { cookies } from 'next/headers';
import Navbar from '../ui/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('_session')?.value;
  return (
    <>
      <header className="flex h-fit w-full justify-center border-b-[1px] border-accent-light bg-background-light max-lg:fixed max-lg:z-50">
        <Navbar token={token} />
      </header>
      <main className="min-h-[300px] max-lg:pt-14">{children}</main>
      <footer></footer>
    </>
  );
}
