import { sql } from '@vercel/postgres';
import { BookType, CreateBookType, RequestType, UserType } from './definitions';

export const guest = {
  fetchCatalog: async function (
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    const books = await sql<BookType>`
      SELECT
        id,
        title,
        author,
      FROM books
      WHERE borrowerid IS NULL AND requestid IS NULL AND 
        (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
      ORDER BY title ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return books.rows;
  },
  fetchCatalogPages: async function (query: string) {
    const booksPages = await sql`
      SELECT COUNT(*)
      FROM books
      WHERE borrowerid IS NULL AND requestid IS NULL AND 
        (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
    `;
    return booksPages.rows[0].count;
  },
};

/**
 * Button states:
 *
 * borrowerid == userid && requestid          REVOKE RETURN REQUEST
 * borrowerid != userid && requestid          NOT POSSIBLE
 * !borrowerid && requestid                   REVOKE CHECK OUT REQUEST
 * borrowerid == userid && !requestid         RETURN
 * borrowerid != userid && !requestid         SOMEONE ELSES RETURN, ONLY ADMIN CAN SEE
 * !borrowerid && !requestid                  REQUEST
 */

export const user = {
  fetchCatalog: async function (
    user: UserType,
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
    const books = await sql<BookType>`
          SELECT
            id,
            title,
            author,
            borrowerid,
            requestid
          FROM books
          WHERE 
            (borrowerid = ${user.id} OR borrowerid IS NULL) AND
            (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
          ORDER BY title ASC
          LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return books.rows;
  },
  fetchCatalogPages: async function (user: UserType, query: string) {
    const booksPages = await sql`
          SELECT COUNT(*)
          FROM books
          WHERE 
          (borrowerid = ${user.id} OR borrowerid IS NULL) AND
            (title ILIKE ${`%${query}%`} OR author ILIKE ${`%${query}%`})
        `;
    return booksPages.rows[0].count;
  },
};

export const admin = {
  fetchCatalog: async function (
    user: UserType,
    query: string,
    ITEMS_PER_PAGE: number,
    offset: number,
  ) {
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
                ((books.borrowerid = ${user.id} OR books.borrowerid IS NULL) OR 
                (books.requestid IS NULL)) AND
                (books.title ILIKE ${`%${query}%`} OR books.author ILIKE ${`%${query}%`})
              ORDER BY title ASC
              LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
            `;
    return books.rows;
  },
  fetchCatalogPages: async function (user: UserType, query: string) {
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
    await sql`
      INSERT INTO books (title, author)
      VALUES (${book.title}, ${book.author})
    `;
    await sql`
      INSERT INTO logs (permission, userid)
      VALUES ('CREATE_BOOK', ${user.id})`;
  },
  editBook: async function (book: BookType, user: UserType) {
    await sql`
      UPDATE books
      SET title = ${book.title}, author = ${book.author}
      WHERE id = ${book.id}
    `;
    await sql`
      INSERT INTO logs (permission, userid)
      VALUES ('UPDATE_BOOK', ${user.id})`;
  },
};

export const userOrAdmin = {
  saveRequest: async function (book: BookType, user: UserType) {
    if (book.requestid) {
      await sql`
        UPDATE books
        SET requestid = NULL
        WHERE id = ${book.id}
      `;
      await sql`
        DELETE FROM requests
        WHERE userid = ${book.borrowerid} AND bookid = ${book.id}
      `;
      if (book.borrowerid) {
        await sql`
          INSERT INTO logs (permission, userid)
          VALUES ('REVOKE_RETURN_BOOK', ${user.id})`;
      } else {
        await sql`
            INSERT INTO logs (permission, userid)
            VALUES ('REVOKE_REQUEST_BOOK', ${user.id})`;
      }
    } else {
      let request;
      if (book.borrowerid) {
        request = await sql`
            INSERT INTO requests (requestname, userid, bookid)
            VALUES ('RETURN_BOOK', ${book.borrowerid}, ${book.id})
            RETURNING id
          `;
        await sql`
            INSERT INTO logs (permission, userid)
            VALUES ('RETURN_BOOK', ${user.id})`;
      } else {
        request = await sql`
            INSERT INTO requests (requestname, userid, bookid)
            VALUES ('REQUEST_BOOK', ${user.id}, ${book.id})
            RETURNING id
          `;
        await sql`
            INSERT INTO logs (permission, userid)
            VALUES ('REQUEST_BOOK', ${user.id})`;
      }
      await sql`
        UPDATE books
        SET requestid = ${request.rows[0].id}
        WHERE id = ${book.id}
      `;
    }
  },
};

const queries = {
  guest,
  user,
  admin,
  userOrAdmin,
};

export default queries;
