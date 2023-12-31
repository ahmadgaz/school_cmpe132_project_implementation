import { BookType, UserType } from '@/lib/definitions';
import { RequestButton } from './buttons';

export default function Result({
  book,
  user,
  token,
}: {
  book: BookType;
  user?: UserType;
  token?: string;
}) {
  return (
    <li className="flex h-fit min-h-[85px] w-full items-center justify-between gap-4 border-t-[1px] border-accent-light pb-1 pr-6 pt-1">
      <hgroup className="flex h-fit flex-col gap-1">
        <h1 className="text-[24px] font-semibold leading-6 text-text-black">
          {book.title}
        </h1>
        <p className="text-[12px] font-semibold text-text-gray">
          by {book.author}
        </p>
      </hgroup>
      <RequestButton book={book} user={user} token={token} />
    </li>
  );
}
