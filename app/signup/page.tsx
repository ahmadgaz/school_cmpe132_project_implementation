import Logo from '@/app/ui/logo';
import SignupForm from '@/app/ui/signup-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[600px] flex-col space-y-2.5 p-4 md:-mt-32">
        <SignupForm />
      </div>
      <a className="w-fit" href="/">
        <Logo />
      </a>
    </main>
  );
}
