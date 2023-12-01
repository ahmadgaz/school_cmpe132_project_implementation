import Link from 'next/link';
import NavLink from '@/app/ui/navlink';
import Logo from '@/app/ui/logo';
import PathnameState from '../state/pathnameState';
import NavButton from './navbutton';
import api from '@/lib/api';

const links = [
  { name: 'Log in', href: '/login' },
  { name: 'Sign up', href: '/signup' },
  { name: 'Sign out', href: '/signout' },
  { name: 'Home', href: '/' },
  { name: 'Books', href: '/books' },
  {
    name: 'Catalog',
    href: '/catalog',
  },
  {
    name: 'Profile',
    href: '/profile',
  },
  {
    name: 'Users',
    href: '/users',
  },
  {
    name: 'Requests',
    href: '/requests',
  },
  {
    name: 'Logs',
    href: '/logs',
  },
];

export default async function Navbar() {
  const role = await api.fetchRole();
  return (
    <nav className="max-width flex items-center justify-between px-2 max-lg:flex-col">
      <Link className="min-h-[50px] w-fit" href="/">
        <Logo />
      </Link>
      <ul className="flex h-full items-center max-lg:h-14">
        <PathnameState>
          {role === 'GUEST' && (
            <>
              <li className="flex h-full items-center">
                <NavLink name={links[3].name} href={links[3].href} />
              </li>
              <li className="flex h-full items-center">
                <NavLink name={links[5].name} href={links[5].href} />
              </li>
              <li className="flex h-full items-center px-2">
                <NavButton
                  className="button-primary w-fit"
                  name={links[0].name}
                  href={links[0].href}
                />
              </li>
              <li className="flex h-full items-center px-2">
                <NavButton
                  className="button-primary w-fit"
                  name={links[1].name}
                  href={links[1].href}
                />
              </li>
            </>
          )}
          {role == 'USER' && (
            <>
              <li className="flex h-full items-center">
                <NavLink name={links[4].name} href={links[4].href} />
              </li>
              <li className="flex h-full items-center">
                <NavLink name={links[5].name} href={links[5].href} />
              </li>
              <li className="flex h-full items-center">
                <NavLink name={links[6].name} href={links[6].href} />
              </li>
              <li className="flex h-full items-center px-2">
                <NavButton
                  className="button-secondary w-fit"
                  name={links[2].name}
                  href={links[2].href}
                />
              </li>
            </>
          )}
          {role == 'ADMIN' && (
            <>
              <li className="flex h-full items-center">
                <NavLink name={links[4].name} href={links[4].href} />
              </li>
              <li className="flex h-full items-center">
                <NavLink name={links[5].name} href={links[5].href} />
              </li>
              <li className="flex h-full items-center">
                <NavLink name={links[6].name} href={links[6].href} />
              </li>
              <li className="flex h-full items-center">
                <NavLink name={links[7].name} href={links[7].href} />
              </li>
              <li className="flex h-full items-center">
                <NavLink name={links[8].name} href={links[8].href} />
              </li>
              <li className="flex h-full items-center">
                <NavLink name={links[9].name} href={links[9].href} />
              </li>
              <li className="flex h-full items-center px-2">
                <NavButton
                  className="button-secondary w-fit"
                  name={links[2].name}
                  href={links[2].href}
                />
              </li>
            </>
          )}
        </PathnameState>
      </ul>
    </nav>
  );
}
