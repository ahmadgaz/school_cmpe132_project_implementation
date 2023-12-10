'use client';

import NavButton from './navbutton';
import NavLink from './navlink';

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
  {
    name: 'Test',
    href: '/test',
  },
];

export default function NavLinks({ role }: { role: string }) {
  return (
    <>
      {role === 'GUEST' && (
        <ul className="flex max-lg:flex-col lg:h-full lg:flex-row-reverse">
          <ul className="flex">
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
          </ul>
          <ul className="flex max-lg:flex-col max-lg:gap-4 max-lg:py-4 lg:h-full">
            <li className="flex h-full items-center">
              <NavLink name={links[3].name} href={links[3].href} />
            </li>
            <li className="flex h-full items-center">
              <NavLink name={links[5].name} href={links[5].href} />
            </li>
          </ul>
        </ul>
      )}
      {role == 'USER' && (
        <ul className="flex max-lg:flex-col lg:h-full lg:flex-row-reverse">
          <li className="flex h-full items-center px-2">
            <NavButton
              className="button-secondary w-fit"
              name={links[2].name}
              href={links[2].href}
            />
          </li>
          <ul className="flex max-lg:flex-col max-lg:gap-4 max-lg:py-4 lg:h-full">
            <li className="flex h-full items-center">
              <NavLink name={links[4].name} href={links[4].href} />
            </li>
            <li className="flex h-full items-center">
              <NavLink name={links[5].name} href={links[5].href} />
            </li>
            <li className="flex h-full items-center">
              <NavLink name={links[6].name} href={links[6].href} />
            </li>
          </ul>
        </ul>
      )}
      {role == 'ADMIN' && (
        <ul className="flex max-lg:flex-col lg:h-full lg:flex-row-reverse">
          <li className="flex h-full items-center px-2">
            <NavButton
              className="button-secondary w-fit"
              name={links[2].name}
              href={links[2].href}
            />
          </li>
          <ul className="flex max-lg:flex-col max-lg:gap-4 max-lg:py-4 lg:h-full">
            <li className="flex h-full items-center">
              <NavLink name={links[4].name} href={links[4].href} />
            </li>
            <li className="flex h-full items-center">
              <NavLink name={links[5].name} href={links[5].href} />
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
            <li className="flex h-full items-center">
              <NavLink name={links[10].name} href={links[10].href} />
            </li>
          </ul>
        </ul>
      )}
    </>
  );
}
