import { LogType } from '@/lib/definitions';
export default function Result({ log }: { log: LogType }) {
  return (
    <li className="flex h-fit min-h-[85px] w-full items-center justify-between gap-4 border-t-[1px] border-accent-light pb-1 pr-6 pt-1">
      <hgroup className="flex h-fit flex-col gap-1">
        {log.permission === 'DELETE_BOOK' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} deleted book {log.affectedbook?.title}.
          </h1>
        )}
        {log.permission === 'UPDATE_BOOK' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} updated book {log.affectedbook?.title} to{' '}
            {log.newbook?.title}.
          </h1>
        )}
        {log.permission === 'CREATE_BOOK' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} created book {log.newbook?.title}.
          </h1>
        )}
        {log.permission === 'CHECKIN_BOOK' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} checked in book {log.affectedbook?.title} from{' '}
            {log.affectedrequest?.username}.
          </h1>
        )}
        {log.permission === 'CHECKOUT_BOOK' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} checked out book {log.affectedbook?.title} to{' '}
            {log.affectedrequest?.username}.
          </h1>
        )}
        {log.permission === 'ADD_USER' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} added user {log.newuser?.username}.
          </h1>
        )}
        {log.permission === 'DELETE_USER' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} deleted user {log.affecteduser?.username}.
          </h1>
        )}
        {log.permission === 'RETURN_BOOK' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} requested a return on book {log.affectedbook?.title}{' '}
            from {log.affectedrequest?.username}.
          </h1>
        )}
        {log.permission === 'REVOKE_RETURN_BOOK' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} denied return request of book{' '}
            {log.affectedbook?.title} from {log.affectedrequest?.username}.
          </h1>
        )}
        {log.permission === 'REQUEST_BOOK' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} requested a checkout on book{' '}
            {log.affectedbook?.title} to {log.affectedrequest?.username}.
          </h1>
        )}
        {log.permission === 'REVOKE_REQUEST_BOOK' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} denied checkout request of book{' '}
            {log.affectedbook?.title} to {log.affectedrequest?.username}.
          </h1>
        )}
        {log.permission === 'UPDATE_PROFILE' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} updated profile.
          </h1>
        )}
        {log.permission === 'DELETE_PROFILE' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} deleted profile.
          </h1>
        )}
        {log.permission === 'REGISTERED' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} registered.
          </h1>
        )}
        {log.permission === 'VIEW_USER' && (
          <h1 className="text-[20px] font-semibold italic leading-6 text-text-gray">
            {log.username} viewed user {log.affecteduser?.username}.
          </h1>
        )}
        <p className="text-[12px] text-text-gray">{String(log.createdat)}</p>
      </hgroup>
    </li>
  );
}
