import { sql } from '@vercel/postgres';
import {
  BookType,
  CreateBookType,
  LogType,
  RequestType,
  UserAuthType,
  UserType,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

export const guest = {
  fetchCatalog: async function (
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    noStore();
    const books = await sql<BookType>`
      SELECT
        id,
        title,
        author
      FROM books
      WHERE borrowerid IS NULL AND requestid IS NULL AND 
        (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
      ORDER BY title ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return books.rows;
  },
  fetchCatalogPages: async function (query: string) {
    noStore();
    const booksPages = await sql`
      SELECT COUNT(*)
      FROM books
      WHERE borrowerid IS NULL AND requestid IS NULL AND 
        (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
    `;
    return booksPages.rows[0].count;
  },
  register: async function (username: string, password: string) {
    noStore();
    await sql`
    INSERT INTO users (username, password, role)
    VALUES (${username}, ${password}, 'USER')
  `;
    const newprofile = await sql<UserType>`
    SELECT *
    FROM users
    WHERE users.username = ${username}
  `;
    await sql`
    INSERT INTO logs (permission, userid, username, newuser)
    VALUES ('REGISTERED', ${newprofile.rows[0].id}, ${
      newprofile.rows[0].username
    }, ${JSON.stringify(newprofile.rows[0])})`;
  },
  fetchUserByUsername: async function (username: string) {
    noStore();
    const user = await sql<UserAuthType>`
      SELECT *
      FROM users
      WHERE users.username = ${username}
    `;
    return user.rows[0];
  },
};

/**
 * Button states:
 *
 * borrowerid == userid && requestid          REVOKE RETURN REQUEST
 * borrowerid != userid && requestid          SOMEONE ELSES REVOKE RETURN REQUEST
 * !borrowerid && requestid                   ANYONES REVOKE CHECK OUT REQUEST
 * borrowerid == userid && !requestid         RETURN
 * borrowerid != userid && !requestid         SOMEONE ELSES RETURN, ONLY ADMIN CAN SEE ANYONE'S BOOKS
 * !borrowerid && !requestid                  REQUEST
 */

export const user = {
  fetchCatalog: async function (
    user: UserType,
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    noStore();
    const books = await sql<BookType>`
          SELECT *
          FROM books
          WHERE 
            (
              books.requestid IN (SELECT id FROM requests WHERE requests.userId = ${
                user.id
              }) OR
              (books.borrowerid = ${user.id} AND books.requestid IS NOT NULL) OR
              (books.borrowerid = ${user.id} AND books.requestid IS NULL) OR
              (books.borrowerid IS NULL AND books.requestid IS NULL)
            ) AND
            (books.title ILIKE ${`%${query}%`} OR books.author ILIKE ${`%${query}%`})
          ORDER BY title ASC
          LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return books.rows;
  },
  fetchCatalogPages: async function (user: UserType, query: string) {
    noStore();
    const booksPages = await sql`
          SELECT COUNT(*)
          FROM books
          WHERE 
          (borrowerid = ${user.id} OR borrowerid IS NULL) AND
            (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
        `;
    return booksPages.rows[0].count;
  },
  updateProfile: async function (user: UserAuthType) {
    noStore();
    const oldprofile = await sql<UserType>`
      SELECT *
      FROM users
      WHERE users.id = ${user.id}
    `;
    await sql`
      UPDATE users
      SET username = ${user.username}, password = ${user.password}
      WHERE id = ${user.id}
    `;
    await sql`
      INSERT INTO logs (permission, userid, username, affecteduserid, affecteduser, newuser)
      VALUES ('UPDATE_PROFILE', ${user.id}, ${user.username}, ${
        oldprofile.rows[0].id
      }, ${JSON.stringify(oldprofile.rows[0])}, ${JSON.stringify(user)})`;
  },
  deleteProfile: async function (id: string, user: UserType) {
    noStore();
    const deletedprofile = await sql<UserType>`
      SELECT *
      FROM users
      WHERE users.id = ${id}
    `;
    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `;
    await sql`
      INSERT INTO logs (permission, username, affecteduser)
      VALUES ('DELETE_PROFILE', ${user.username}, ${JSON.stringify(
        deletedprofile.rows[0],
      )})`;
  },
};

export const admin = {
  fetchCatalog: async function (
    user: UserType,
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    noStore();
    const books = await sql<BookType>`
              SELECT
                books.id,
                books.title,
                books.author,
                books.borrowerid,
                books.requestid,
                CASE WHEN books.borrowerid != ${
                  user.id
                } THEN users.username ELSE NULL END AS borrowername
              FROM books
              LEFT JOIN users ON books.borrowerid = users.id
              WHERE 
                (
                  books.requestid IN (SELECT id FROM requests WHERE requests.userId = ${
                    user.id
                  }) OR
                  (books.borrowerid = ${
                    user.id
                  } AND books.requestid IS NOT NULL) OR
                  (books.borrowerid = ${user.id} AND books.requestid IS NULL) OR
                  (books.borrowerid != ${
                    user.id
                  } AND books.requestid IS NULL) OR
                  (books.borrowerid IS NULL AND books.requestid IS NULL)
                ) AND
                (books.title ILIKE ${`%${query}%`} OR books.author ILIKE ${`%${query}%`})
              ORDER BY title ASC
              LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
            `;
    return books.rows;
  },
  fetchCatalogPages: async function (user: UserType, query: string) {
    noStore();
    const booksPages = await sql`
              SELECT COUNT(*)
              FROM books
              WHERE 
                ((borrowerid = ${user.id} OR borrowerid IS NULL) OR 
                (requestid IS NULL)) AND
                (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
            `;
    return booksPages.rows[0].count;
  },
  fetchBook: async function (bookid: string) {
    noStore();
    const book = await sql<BookType>`
      SELECT
        id,
        title,
        author
      FROM books
      WHERE books.id = ${bookid}
    `;
    return book.rows[0];
  },
  createBook: async function (book: CreateBookType, user: UserType) {
    noStore();
    await sql`
      INSERT INTO books (title, author)
      VALUES (${book.title}, ${book.author})
    `;
    await sql`
      INSERT INTO logs (permission, userid, username, newbook)
      VALUES ('CREATE_BOOK', ${user.id}, ${user.username}, ${JSON.stringify(
        book,
      )})`;
  },
  updateBook: async function (book: BookType, user: UserType) {
    noStore();
    const oldbook = await sql<BookType>`
      SELECT *
      FROM books
      WHERE books.id = ${book.id}
    `;
    await sql`
      UPDATE books
      SET title = ${book.title}, author = ${book.author}
      WHERE id = ${book.id}
    `;
    await sql`
      INSERT INTO logs (permission, userid, username, affectedbookid, affectedbook, newbook)
      VALUES ('UPDATE_BOOK', ${user.id}, ${user.username}, ${
        book.id
      }, ${JSON.stringify(oldbook.rows[0])}, ${JSON.stringify(book)})`;
  },
  deleteBook: async function (id: string, user: UserType) {
    noStore();
    const deletedbook = await sql<BookType>`
      SELECT *
      FROM books
      WHERE books.id = ${id}
    `;
    await sql`
      DELETE FROM books
      WHERE id = ${id}
    `;
    await sql`
      INSERT INTO logs (permission, userid, username, affectedbook)
      VALUES ('DELETE_BOOK', ${user.id}, ${user.username}, ${JSON.stringify(
        deletedbook.rows[0],
      )})`;
  },
  addUser: async function (
    user: UserType,
    username: string,
    password: string,
    role: string,
  ) {
    noStore();
    await sql`
      INSERT INTO users (username, password, role)
      VALUES (${username}, ${password}, ${role})
    `;
    const newuser = await sql<UserType>`
      SELECT *
      FROM users
      WHERE users.username = ${username}
    `;
    await sql`
      INSERT INTO logs (permission, userid, username, newuser)
      VALUES ('ADD_USER', ${user.id}, ${user.username}, ${JSON.stringify(
        newuser.rows[0],
      )})`;
  },
  deleteUser: async function (id: string, user: UserType) {
    noStore();
    const deleteduser = await sql<UserType>`
      SELECT *
      FROM users
      WHERE users.id = ${id}
    `;
    await sql`
      DELETE FROM users
      WHERE id = ${id} AND id != ${user.id}
    `;
    await sql`
      INSERT INTO logs (permission, userid, username, affecteduser)
      VALUES ('DELETE_USER', ${user.id}, ${user.username}, ${JSON.stringify(
        deleteduser.rows[0],
      )})`;
  },
  fetchUserBooks: async function (
    id: string,
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    noStore();
    const books = await sql<BookType>`
          SELECT *
          FROM books
          WHERE 
          books.borrowerid = ${id} AND
            (books.title ILIKE ${`%${query}%`} OR books.author ILIKE ${`%${query}%`})
          ORDER BY books.title ASC
          LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return books.rows;
  },
  fetchUserBooksPages: async function (id: string, query: string) {
    noStore();
    const booksPages = await sql`
          SELECT COUNT(*)
          FROM books
          WHERE 
          borrowerid = ${id} AND
            (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
        `;
    return booksPages.rows[0].count;
  },
  fetchUserById: async function (userid: string, user: UserType) {
    noStore();
    const userQuery = await sql<UserType>`
      SELECT
        id,
        username,
        role
      FROM users
      WHERE users.id = ${userid}
    `;
    await sql`
    INSERT INTO logs (permission, userid, username, affecteduserid, affecteduser)
    VALUES ('VIEW_USER', ${user.id}, ${
      user.username
    }, ${userid}, ${JSON.stringify(userQuery.rows[0])})`;
    return userQuery.rows[0];
  },
  fetchUsers: async function (
    user: UserType,
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    noStore();
    const users = await sql<UserType>`
              SELECT
                users.id,
                users.username,
                users.role,
                array_agg(books.title) AS books
              FROM users
              LEFT JOIN books ON users.id = books.borrowerid
              WHERE 
                users.id != ${user.id} AND
                (users.username ILIKE ${`%${query}%`} OR users.role ILIKE ${`%${query}%`})
              GROUP BY users.id
              ORDER BY users.username ASC
              LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
            `;
    return users.rows;
  },
  fetchUsersPages: async function (user: UserType, query: string) {
    noStore();
    const usersPages = await sql`
              SELECT COUNT(*)
              FROM users
              LEFT JOIN books ON users.id = books.borrowerid
              WHERE 
                users.id != ${user.id} AND
                (users.username ILIKE ${`%${query}%`} OR users.role ILIKE ${`%${query}%`})
              `;
    return usersPages.rows[0].count;
  },
  fetchRequests: async function (
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    noStore();
    const requests = await sql<RequestType>`
              SELECT
                requests.id,
                requests.requestname,
                requests.userid,
                users.username AS username,
                requests.bookid,
                books.title AS booktitle
              FROM requests
              LEFT JOIN users ON requests.userid = users.id
              LEFT JOIN books ON requests.bookid = books.id
              WHERE 
                (users.username ILIKE ${`%${query}%`} OR books.title ILIKE ${`%${query}%`})
              ORDER BY users.username DESC
              LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
            `;
    return requests.rows;
  },
  fetchRequestsPages: async function (query: string) {
    noStore();
    const requestsPages = await sql`
              SELECT COUNT(*)
              FROM requests
              LEFT JOIN users ON requests.userid = users.id
              LEFT JOIN books ON requests.bookid = books.id
              WHERE 
                (users.username ILIKE ${`%${query}%`} OR books.title ILIKE ${`%${query}%`})
              `;
    return requestsPages.rows[0].count;
  },
  acceptRequest: async function (request: RequestType, user: UserType) {
    noStore();
    const book = await sql<BookType>`
      SELECT *
      FROM books
      WHERE books.id = ${request.bookid}
    `;
    if (request.requestname === 'RETURN_BOOK') {
      await sql`
      UPDATE books
      SET borrowerid = NULL, requestid = NULL
      WHERE id = ${request.bookid}
    `;
      await sql`
    INSERT INTO logs (permission, userid, username, affectedrequest, affectedbookid, affectedbook)
    VALUES ('CHECKIN_BOOK', ${user.id}, ${user.username}, ${JSON.stringify(
      request,
    )}, ${request.bookid}, ${JSON.stringify(book.rows[0])})`;
    } else {
      await sql`
        UPDATE books
        SET borrowerid = ${request.userid}, requestid = NULL
        WHERE id = ${request.bookid}
      `;
      await sql`
      INSERT INTO logs (permission, userid, username, affectedrequest, affectedbookid, affectedbook)
      VALUES ('CHECKOUT_BOOK', ${user.id}, ${user.username}, ${JSON.stringify(
        request,
      )}, ${request.bookid}, ${JSON.stringify(book.rows[0])})`;
    }
    await sql`
      DELETE FROM requests
      WHERE id = ${request.id}
    `;
  },
  denyRequest: async function (request: RequestType, user: UserType) {
    noStore();
    await sql`
      DELETE FROM requests
      WHERE id = ${request.id}
    `;
    await sql`
      INSERT INTO logs (permission, userid, username,affectedrequest)
      VALUES ('REVOKE_REQUEST_BOOK', ${user.id}, ${
        user.username
      }, ${JSON.stringify(request)})`;
  },
  fetchLogs: async function (
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    noStore();
    const logs = await sql<LogType>`
              SELECT *
              FROM logs
              WHERE 
                (username ILIKE ${`%${query}%`} OR permission ILIKE ${`%${query}%`})
              ORDER BY logs.createdat DESC
              LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
            `;
    return logs.rows;
  },
  fetchLogsPages: async function (query: string) {
    noStore();
    const logsPages = await sql`
              SELECT COUNT(*)
              FROM logs
              WHERE 
                (username ILIKE ${`%${query}%`} OR permission ILIKE ${`%${query}%`})
              `;
    return logsPages.rows[0].count;
  },
};

export const userOrAdmin = {
  saveRequest: async function (book: BookType, user: UserType) {
    noStore();
    let request;
    if (book.requestid) {
      request = await sql<RequestType>`
        SELECT
            requests.id,
            requests.requestname,
            requests.userid,
            users.username AS username,
            requests.bookid,
            books.title AS booktitle
        FROM requests
        LEFT JOIN users ON requests.userid = users.id
        LEFT JOIN books ON requests.bookid = books.id
        WHERE requests.id = ${book.requestid}
      `;
      await sql`
        UPDATE books
        SET requestid = NULL
        WHERE id = ${book.id}
      `;
      if (book.borrowerid) {
        await sql`
          DELETE FROM requests
          WHERE userid = ${book.borrowerid} AND bookid = ${book.id}
        `;
        await sql`
        INSERT INTO logs (permission, userid, username, affectedbookid, affectedbook, affectedrequest)
        VALUES ('REVOKE_RETURN_BOOK', ${user.id}, ${user.username}, ${
          book.id
        }, ${JSON.stringify(book)} , ${JSON.stringify(request.rows[0])})`;
      } else {
        await sql`
          DELETE FROM requests
          WHERE userid = ${user.id} AND bookid = ${book.id}
        `;
        await sql`
            INSERT INTO logs (permission, userid, username, affectedbookid, affectedbook, affectedrequest)
            VALUES ('REVOKE_REQUEST_BOOK', ${user.id}, ${user.username}, ${
              book.id
            }, ${JSON.stringify(book)}, ${JSON.stringify(request.rows[0])})`;
      }
    } else {
      if (book.borrowerid) {
        const requestid = await sql`
            INSERT INTO requests (requestname, userid, bookid)
            VALUES ('RETURN_BOOK', ${book.borrowerid}, ${book.id})
            RETURNING id
          `;
        request = await sql<RequestType>`
            SELECT
                requests.id,
                requests.requestname,
                requests.userid,
                users.username AS username,
                requests.bookid,
                books.title AS booktitle
            FROM requests
            LEFT JOIN users ON requests.userid = users.id
            LEFT JOIN books ON requests.bookid = books.id
            WHERE requests.id = ${String(requestid.rows[0].id)};`;
        await sql`
            INSERT INTO logs (permission, userid, username, affectedrequestid, affectedrequest, affectedbookid, affectedbook)
            VALUES ('RETURN_BOOK', ${user.id}, ${user.username}, ${
              request.rows[0].id
            }, ${JSON.stringify(request.rows[0])}, ${book.id}, ${JSON.stringify(
              book,
            )})`;
      } else {
        const requestid = await sql`
            INSERT INTO requests (requestname, userid, bookid)
            VALUES ('REQUEST_BOOK', ${user.id}, ${book.id})
            RETURNING id
          `;
        request = await sql<RequestType>`
            SELECT
                requests.id,
                requests.requestname,
                requests.userid,
                users.username AS username,
                requests.bookid,
                books.title AS booktitle
            FROM requests
            LEFT JOIN users ON requests.userid = users.id
            LEFT JOIN books ON requests.bookid = books.id
            WHERE requests.id = ${String(requestid.rows[0].id)};`;
        await sql`
            INSERT INTO logs (permission, userid, username, affectedrequestid, affectedrequest, affectedbookid, affectedbook)
            VALUES ('REQUEST_BOOK', ${user.id}, ${user.username}, ${
              request.rows[0].id
            }, ${JSON.stringify(request.rows[0])}, ${book.id}, ${JSON.stringify(
              book,
            )})`;
      }
      await sql`
        UPDATE books
        SET requestid = ${request.rows[0].id}
        WHERE id = ${book.id}
      `;
    }
  },
  fetchBooks: async function (
    user: UserType,
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    noStore();
    const books = await sql<BookType>`
          SELECT
            id,
            title,
            author,
            borrowerid,
            requestid
          FROM books
          WHERE 
            borrowerid = ${user.id} AND
            (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
          ORDER BY title ASC
          LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return books.rows;
  },
  fetchBooksPages: async function (user: UserType, query: string) {
    noStore();
    const booksPages = await sql`
          SELECT COUNT(*)
          FROM books
          WHERE 
          borrowerid = ${user.id} AND
            (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
        `;
    return booksPages.rows[0].count;
  },
};

const queries = {
  guest,
  user,
  admin,
  userOrAdmin,
};

export default queries;
