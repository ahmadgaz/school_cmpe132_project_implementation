import { RequestType } from '@/app/lib/definitions';
import { AcceptButton, DenyButton } from './buttons';

export default function Result({ request }: { request: RequestType }) {
  return (
    <li className="border-accent-light flex h-fit min-h-[85px] items-center justify-between gap-10 border-t-[1px] pb-1 pr-6 pt-1">
      <hgroup className="flex h-fit flex-col gap-1">
        <h1 className="text-text-gray text-[20px] font-semibold italic leading-6">
          {request.username} would like to{' '}
          {request.requestname === 'REQUEST_BOOK' ? 'borrow' : 'return'}{' '}
          {request.booktitle}
        </h1>
      </hgroup>
      <div className="flex h-full w-fit gap-3">
        <AcceptButton request={request} />
        <DenyButton request={request} />
      </div>
    </li>
  );
}
