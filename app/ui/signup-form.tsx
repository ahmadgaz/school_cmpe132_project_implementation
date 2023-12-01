'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useFormState, useFormStatus } from 'react-dom';
import { addUser } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from './skeletons';

export default function SignUpForm({ token }: { token?: string }) {
  function formAction(prevState: string | undefined, formData: FormData) {
    return addUser(formData, token);
  }
  const searchParams = useSearchParams();
  const [state, dispatch] = useFormState(formAction, undefined);

  return (
    <form action={dispatch} className="space-y-3">
      <div className="border-accent-light flex-1 rounded-[32px] border-[1px] px-12 py-12">
        <h1 className="text-text-black pb-4 text-[28px] font-semibold">
          Sign Up
        </h1>
        <div className="w-full pb-6">
          {/* Username */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                maxLength={255}
                className="input peer border-0"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
        </div>
        <SignupButton />
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
        Already have an account?{' '}
        <a href="/login" className="text-primary-900">
          Log in
        </a>
      </p>
    </form>
  );
}

function SignupButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-primary w-full"
      disabled={pending}
      aria-disabled={pending}
    >
      Sign up {pending && <LoadingSpinner className="ml-auto" />}
      {!pending && <ArrowRightIcon className="ml-auto h-5 w-5" />}
    </button>
  );
}
