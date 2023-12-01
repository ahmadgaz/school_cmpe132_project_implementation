'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { LoadingSpinner } from '../skeletons';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { UserType } from '@/lib/definitions';
import { updateProfile } from '@/lib/actions';

export default function Form({
  user,
  token,
}: {
  user: UserType;
  token?: string;
}) {
  function formAction(prevState: string | undefined, formData: FormData) {
    return updateProfile(formData, token);
  }
  const [state, dispatch] = useFormState(formAction, undefined);

  return (
    <form action={dispatch}>
      <div className="rounded-md">
        <h1 className="text-text-black pt-2 text-[24px] font-semibold">
          Details
        </h1>

        <div className="w-full pb-6">
          {/* User Id */}
          <div>
            <label className="label" hidden htmlFor="id">
              User Id
            </label>
            <div className="relative">
              <input
                maxLength={255}
                className="input read-only:text-text-gray peer"
                id="id"
                type="id"
                name="id"
                placeholder="Enter your id"
                defaultValue={user.id}
                readOnly
                required
              />
            </div>
          </div>

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
                defaultValue={user.username}
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

        {/* Action */}
        <div className="flex flex-wrap items-center justify-between gap-2">
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
      className="button-tertiary flex-1"
      disabled={pending}
      aria-disabled={pending}
    >
      {!pending && 'Save'} {pending && <LoadingSpinner />}
    </button>
  );
}
