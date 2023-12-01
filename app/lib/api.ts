import {
  UserType,
  BookType,
  UserAuthType,
  RequestType,
  LogType,
} from './definitions';
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
    throw String(error) || 'Failed to perform action.';
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchCatalog(query?: string, currentPage?: number) {
  try {
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
          args.query || '',
          args.itemsPerPage,
          args.offset,
        );
        return { books };
      },
      userQuery: async function (args, user) {
        const books = await queries.user.fetchCatalog(
          user,
          args.query || '',
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
          args.query || '',
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
    throw String(error) || 'Failed to fetch books.';
  }
}

export async function fetchCatalogPages(query?: string) {
  try {
    return await queryHelper<{ query?: string }, number>({
      args: { query },
      guestQuery: async function (args) {
        const count = await queries.guest.fetchCatalogPages(args.query || '');
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
      userQuery: async function (args, user) {
        const count = await queries.user.fetchCatalogPages(
          user,
          args.query || '',
        );
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
      adminQuery: async function (args, user) {
        const count = await queries.admin.fetchCatalogPages(
          user,
          args.query || '',
        );
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch books pages.';
  }
}

export async function fetchBook(id?: string) {
  try {
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
    throw String(error) || 'Failed to fetch book.';
  }
}

export async function fetchBooks(query?: string, currentPage?: number) {
  try {
    return await queryHelper<
      { query?: string; itemsPerPage: number; offset: number },
      { books: BookType[]; user?: UserType }
    >({
      args: {
        query,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentPage ? (currentPage - 1) * ITEMS_PER_PAGE : 0,
      },
      userQuery: async function (args, user) {
        const books = await queries.userOrAdmin.fetchBooks(
          user,
          args.query || '',
          args.itemsPerPage,
          args.offset,
        );
        return {
          books,
          user,
        };
      },
      adminQuery: async function (args, user) {
        const books = await queries.userOrAdmin.fetchBooks(
          user,
          args.query || '',
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
    throw String(error) || 'Failed to fetch books.';
  }
}

export async function fetchBooksPages(query?: string) {
  try {
    return await queryHelper<{ query?: string }, number>({
      args: { query },
      userQuery: async function (args, user) {
        const count = await queries.userOrAdmin.fetchBooksPages(
          user,
          args.query || '',
        );
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
      adminQuery: async function (args, user) {
        const count = await queries.userOrAdmin.fetchBooksPages(
          user,
          args.query || '',
        );
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch books pages.';
  }
}

export async function fetchProfile(query?: string, currentPage?: number) {
  try {
    return await queryHelper<{}, { user: UserType }>({
      args: {
        query,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentPage ? (currentPage - 1) * ITEMS_PER_PAGE : 0,
      },
      userQuery: async function (args, user) {
        return { user };
      },
      adminQuery: async function (args, user) {
        return { user };
      },
    }).then((data) => data.user);
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch profile.';
  }
}

export async function fetchUserBooks(
  id?: string,
  query?: string,
  currentPage?: number,
) {
  try {
    return await queryHelper<
      { id?: string; query?: string; itemsPerPage: number; offset: number },
      { books: BookType[] }
    >({
      args: {
        id,
        query,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentPage ? (currentPage - 1) * ITEMS_PER_PAGE : 0,
      },
      adminQuery: async function (args) {
        if (!args.id) throw new Error('Invalid user id.');
        const books = await queries.admin.fetchUserBooks(
          args.id,
          args.query || '',
          args.itemsPerPage,
          args.offset,
        );
        return {
          books,
        };
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch books.';
  }
}

export async function fetchUserBooksPages(id?: string, query?: string) {
  try {
    return await queryHelper<{ id?: string; query?: string }, number>({
      args: { id, query },
      adminQuery: async function (args, user) {
        if (!args.id) throw new Error('Invalid user id.');
        const count = await queries.admin.fetchUserBooksPages(
          args.id,
          args.query || '',
        );
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch books pages.';
  }
}

export async function fetchUserByUsername(username?: string) {
  try {
    return await queryHelper<{ username?: string }, UserAuthType>({
      args: { username },
      guestQuery: async function (args) {
        if (!args.username) throw new Error('Invalid username.');
        const userQuery = await queries.guest.fetchUserByUsername(
          args.username,
        );
        return userQuery;
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch user.';
  }
}

export async function fetchUserById(id?: string) {
  try {
    return await queryHelper<{ id?: string }, UserType>({
      args: { id },
      adminQuery: async function (args, user) {
        if (!args.id) throw new Error('Invalid user id.');
        const userQuery = await queries.admin.fetchUserById(args.id, user);
        return userQuery;
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch user.';
  }
}

export async function fetchUsers(query?: string, currentPage?: number) {
  try {
    return await queryHelper<
      { query?: string; itemsPerPage: number; offset: number },
      { users?: UserType[] }
    >({
      args: {
        query,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentPage ? (currentPage - 1) * ITEMS_PER_PAGE : 0,
      },
      adminQuery: async function (args, user) {
        const users = await queries.admin.fetchUsers(
          user,
          args.query || '',
          args.itemsPerPage,
          args.offset,
        );
        return {
          users,
        };
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch users.';
  }
}

export async function fetchUsersPages(query?: string) {
  try {
    return await queryHelper<{ query?: string }, number>({
      args: { query },
      adminQuery: async function (args, user) {
        const count = await queries.admin.fetchUsersPages(
          user,
          args.query || '',
        );
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch usersw pages.';
  }
}

export async function fetchRequests(query?: string, currentPage?: number) {
  try {
    return await queryHelper<
      { query?: string; itemsPerPage: number; offset: number },
      RequestType[]
    >({
      args: {
        query,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentPage ? (currentPage - 1) * ITEMS_PER_PAGE : 0,
      },
      adminQuery: async function (args, user) {
        const requests = await queries.admin.fetchRequests(
          args.query || '',
          args.itemsPerPage,
          args.offset,
        );
        return requests;
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch requests.';
  }
}

export async function fetchRequestsPages(query?: string) {
  try {
    return await queryHelper<{ query?: string }, number>({
      args: { query },
      adminQuery: async function (args, user) {
        const count = await queries.admin.fetchRequestsPages(args.query || '');
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch requests pages.';
  }
}

export async function fetchLogs(query?: string, currentPage?: number) {
  try {
    return await queryHelper<
      { query?: string; itemsPerPage: number; offset: number },
      LogType[]
    >({
      args: {
        query,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentPage ? (currentPage - 1) * ITEMS_PER_PAGE : 0,
      },
      adminQuery: async function (args, user) {
        const logs = await queries.admin.fetchLogs(
          args.query || '',
          args.itemsPerPage,
          args.offset,
        );
        return logs;
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch logs.';
  }
}

export async function fetchLogsPages(query?: string) {
  try {
    return await queryHelper<{ query?: string }, number>({
      args: { query },
      adminQuery: async function (args, user) {
        const count = await queries.admin.fetchLogsPages(args.query || '');
        return Math.ceil(Number(count) / ITEMS_PER_PAGE);
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch logs pages.';
  }
}

export async function fetchRole() {
  try {
    return await queryHelper<{}, string>({
      args: {},
      guestQuery: async function (args) {
        return 'GUEST';
      },
      userQuery: async function (args, user) {
        return user.role;
      },
      adminQuery: async function (args, user) {
        return user.role;
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to fetch role.';
  }
}

const api = {
  fetchCatalog,
  fetchCatalogPages,
  fetchBook,
  fetchBooks,
  fetchBooksPages,
  fetchProfile,
  fetchUserBooks,
  fetchUserBooksPages,
  fetchUserByUsername,
  fetchUserById,
  fetchUsers,
  fetchUsersPages,
  fetchRequests,
  fetchRequestsPages,
  fetchLogs,
  fetchLogsPages,
  fetchRole,
};

export default api;
