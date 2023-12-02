import Logo from '@/app/ui/logo';
import LoginForm from '@/app/ui/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In',
};

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <LoginForm />
      </div>
      <a className="w-fit" href="/">
        <Logo />
      </a>
    </main>
  );
}
