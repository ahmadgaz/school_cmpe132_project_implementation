'use client';

import { KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '../lib/actions';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from './skeletons';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [state, dispatch] = useFormState(authenticate, undefined);

  return (
    <form action={dispatch} className="space-y-3">
      <div className="border-accent-light flex-1 rounded-[32px] border-[1px] px-12 py-12">
        <h1 className="text-text-black pb-4 text-[28px] font-semibold">
          Log In
        </h1>
        <div className="w-full pb-6">
          <div>
            <label className="label" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <input
                maxLength={255}
                className="input peer"
                id="username"
                type="username"
                name="username"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                maxLength={255}
                className="input peer border-0"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
        </div>
        <LoginButton />
        <div
          className="flex items-end space-x-1 pt-3"
          aria-live="polite"
          aria-atomic="true"
        >
          {state && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state}</p>
            </>
          )}
          {searchParams.get('error') && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">
                The token is invalid or there has been an error on our end.
              </p>
            </>
          )}
        </div>
      </div>
      <p className="text-center">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-primary-900">
          Sign up
        </a>
      </p>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-primary w-full"
      disabled={pending}
      aria-disabled={pending}
    >
      Log in {pending && <LoadingSpinner className="ml-auto" />}
      {!pending && <ArrowRightIcon className="ml-auto h-5 w-5" />}
    </button>
  );
}
