'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { LoadingSpinner } from '../skeletons';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import PathnameState from '@/app/state/pathnameState';
import NavButton from '../navbutton';
import { createBook } from '@/lib/actions';

export default function Form() {
  const [state, dispatch] = useFormState(createBook, undefined);

  return (
    <form action={dispatch}>
      <div className="rounded-md">
        <h1 className="text-text-black pt-2 text-[24px] font-semibold">
          Details
        </h1>

        {/* Book Title */}
        <div className="w-full pb-6">
          <div>
            <label className="label" htmlFor="title">
              Book Title
            </label>
            <div className="relative">
              <input
                maxLength={255}
                className="input peer"
                id="title"
                type="title"
                name="title"
                placeholder="Enter your title"
                required
              />
            </div>
          </div>

          {/* Book Author */}
          <div>
            <label className="label" htmlFor="author">
              Book Author
            </label>
            <div className="relative">
              <input
                maxLength={255}
                className="input peer border-0"
                id="author"
                type="author"
                name="author"
                placeholder="Enter your author"
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
              href="/catalog"
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
