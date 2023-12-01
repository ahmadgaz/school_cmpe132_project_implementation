'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { LoadingSpinner } from '../skeletons';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import PathnameState from '@/app/state/pathnameState';
import NavButton from '../navbutton';
import { addUser } from '@/lib/actions';

export default function Form() {
  const [state, dispatch] = useFormState(addUser, undefined);

  return (
    <form action={dispatch}>
      <div className="rounded-md">
        <h1 className="text-text-black pt-2 text-[24px] font-semibold">
          Details
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

          {/* Role */}
          <div>
            <label className="label" htmlFor="role">
              Role
            </label>
            <div className="relative">
              <select
                className="input peer border-0"
                id="role"
                name="role"
                required
              >
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
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
        {/* Action */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PathnameState>
            <NavButton
              className="button-secondary flex-1"
              name="Cancel"
              href="/users"
            />
          </PathnameState>
          <SubmitButton />
        </div>
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
        </div>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-primary flex-1"
      disabled={pending}
      aria-disabled={pending}
    >
      {!pending && 'Add'} {pending && <LoadingSpinner />}
    </button>
  );
}
