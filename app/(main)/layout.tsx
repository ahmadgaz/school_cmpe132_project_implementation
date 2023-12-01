import { cookies } from 'next/headers';
import Navbar from '../ui/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('_session')?.value;
  return (
    <>
      <header className="border-accent-light flex w-full justify-center border-b-[1px]">
        <Navbar token={token} />
      </header>
      <main className="min-h-[300px]">{children}</main>
      <footer></footer>
    </>
  );
}
