import { BookType } from '@/app/lib/definitions';

export default function Results({ books }: { books: BookType[] }) {
  return (
    <ul>
      {books?.map((book, i) => (
        <li
          key={i}
          className="border-accent-light flex h-[85px] flex-col gap-1 border-t-[1px] pt-3"
        >
          <h1 className="text-text-black h-8 text-[24px] font-semibold">
            {book.title}
          </h1>
          <p className="text-text-gray text-[12px] font-semibold">
            by {book.author}
          </p>
        </li>
      ))}
      {!books?.length && (
        <li className="flex h-[85px] flex-col justify-center gap-1 pt-3">
          <h1 className="text-text-gray h-8 text-center text-[24px] font-semibold italic">
            Sorry, no books are currently available!
          </h1>
        </li>
      )}
    </ul>
  );
}
