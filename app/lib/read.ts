import { UserType, BookType, RequestType } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { jwtVerify } from 'jose';
import queries from './queries';
import { cookies } from 'next/headers';

/**
 * @vercel/postgres STRING LITERALS ARE SAFE SQL QUERIES!
 * In Javascript, you can define a function that processes string literals
 * These are called template literal tag functions.
 * They are called with two arguments: an array of string literals and an array of substitutions.
 * The array of string literals contains the template literal split by the values between each "${}".
 * The array of substitutions contains the values between each "${}".
 *
 * For example:
 * let name = "Jane"
 * function greeting(strings, name){
 *   console.log(strings) // ["Testing", "this"]
 *   console.log(name) // "Jane"
 *   return `Hello, ${name}`
 * }
 * greeting`Testing ${name} this`
 *
 * The sql function is a template literal tag function.
 * It is safe because it uses parameterized queries.
 * Parameterized queries are a way to pass values to a SQL query without
 * concatenating them into the query string.
 * The database will always treat data as data and not as SQL code in a parameterized query.
 */

async function queryHelper<Arguments, ReturnValue>(queries: {
  args: Arguments;
  guestQuery?: (args: Arguments) => Promise<ReturnValue>;
  userQuery?: (args: Arguments, user: UserType) => Promise<ReturnValue>;
  adminQuery?: (args: Arguments, user: UserType) => Promise<ReturnValue>;
}) {
  try {
    const token = cookies().get('_session')?.value;

    if (!token)
      if (typeof queries.guestQuery === 'function')
        return queries.guestQuery(queries.args);
      else throw new Error('You must be signed in to perform this action.');

    const verified = (
      await jwtVerify(
        String(token),
        new TextEncoder().encode(process.env.AUTH_SECRET),
      )
    ).payload;

    if (!verified) throw new Error('Invalid token.');

    const user = {
      id: verified.id,
      username: verified.username,
      role: verified.role,
    } as UserType;

    if (user.role === 'USER')
      if (typeof queries.userQuery === 'function')
        return queries.userQuery(queries.args, user);
      else throw new Error('You are not authorized to perform this action.');

    if (user.role === 'ADMIN')
      if (typeof queries.adminQuery === 'function')
        return queries.adminQuery(queries.args, user);
      else throw new Error('You are not authorized to perform this action.');
    else throw new Error('Invalid role.');
  } catch (error) {
    console.error(error);
    throw error as Error;
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchCatalog(query?: string, currentPage?: number) {
  try {
    noStore();
    return await queryHelper<
      { query?: string; itemsPerPage: number; offset: number },
      { books: BookType[]; user?: UserType }
    >({
      args: {
        query,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentPage ? (currentPage - 1) * ITEMS_PER_PAGE : 0,
      },
      guestQuery: async function (args) {
        const books = await queries.guest.fetchCatalog(
          args.query ?? '',
          args.itemsPerPage,
          args.offset,
        );
        return { books };
      },
      userQuery: async function (args, user) {
        const books = await queries.user.fetchCatalog(
          user,
          args.query ?? '',
          args.itemsPerPage,
          args.offset,
        );
        return {
          books,
          user,
        };
      },
      adminQuery: async function (args, user) {
        const books = await queries.admin.fetchCatalog(
          user,
          args.query ?? '',
          args.itemsPerPage,
          args.offset,
        );
        return {
          books,
          user,
        };
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch books.');
  }
}

export async function fetchCatalogPages(query?: string) {
  try {
    noStore();
    return await queryHelper<{ query?: string }, number>({
      args: { query },
      guestQuery: async function (args) {
        const count = await queries.guest.fetchCatalogPages(args.query ?? '');
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
      userQuery: async function (args, user) {
        const count = await queries.user.fetchCatalogPages(
          user,
          args.query ?? '',
        );
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
      adminQuery: async function (args, user) {
        const count = await queries.admin.fetchCatalogPages(
          user,
          args.query ?? '',
        );
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch books pages.');
  }
}

export async function fetchBook(id?: string) {
  try {
    noStore();
    return await queryHelper<{ id?: string }, { book: BookType }>({
      args: { id },
      adminQuery: async function (args, user) {
        if (!args.id) throw new Error('Invalid book id.');
        const book = await queries.admin.fetchBook(args.id);
        return { book };
      },
    }).then((data) => data.book);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch books.');
  }
}

const read = {
  fetchCatalog,
  fetchCatalogPages,
  fetchBook,
};

export default read;
