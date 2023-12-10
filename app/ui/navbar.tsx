import Link from 'next/link';
import Logo from '@/app/ui/logo';
import PathnameState from '../state/pathnameState';
import api from '@/lib/api';
import NavDropdown from './navdropdown';
import NavLinks from './navlinks';

export default async function Navbar({ token }: { token?: string }) {
  const role = await api.fetchRole(token);
  return (
    <>
      {/* Desktop */}
      <nav className="max-width flex items-center justify-between px-2 max-lg:hidden max-lg:flex-col">
        <Link className="min-h-[50px] w-fit" href="/">
          <Logo />
        </Link>

        <ul className="flex h-full items-center max-lg:h-14">
          <PathnameState>
            <NavLinks role={role} />
          </PathnameState>
        </ul>
      </nav>
      {/* Mobile */}
      <nav className="h-fit lg:hidden">
        <PathnameState>
          <NavDropdown>
            <ul className="flex h-fit flex-col items-center gap-8">
              <NavLinks role={role} />
            </ul>
          </NavDropdown>
        </PathnameState>
      </nav>
    </>
  );
}
