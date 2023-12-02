import { RequestType } from '@/lib/definitions';
import { AcceptButton, DenyButton } from './buttons';

export default function Result({
  request,
  token,
}: {
  request: RequestType;
  token?: string;
}) {
  return (
    <li className="flex h-fit min-h-[85px] items-center justify-between border-t-[1px] border-accent-light pb-1 pt-1 max-lg:flex-col max-lg:gap-6 max-lg:py-6 lg:gap-10 lg:pr-6">
      <hgroup className="flex h-fit flex-col gap-1">
        <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
          {request.username} would like to{' '}
          {request.requestname === 'REQUEST_BOOK' ? 'borrow' : 'return'}{' '}
          {request.booktitle}
        </h1>
      </hgroup>
      <div className="flex h-full w-fit gap-3">
        <AcceptButton request={request} token={token} />
        <DenyButton request={request} token={token} />
      </div>
    </li>
  );
}
