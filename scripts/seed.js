const { db } = require('@vercel/postgres');
const { roles, permissions, users, books } = require('./placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedRoles(client) {
  try {
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS roles (
        rolename VARCHAR(50) NOT NULL PRIMARY KEY,
        UNIQUE (rolename)
      );
    `;

    console.log(`Created "roles" table`);

    const insertedRoles = await Promise.all(
      roles.map(
        async (role) => client.sql`
        INSERT INTO roles (rolename)
        VALUES (${role.rolename})
      `,
      ),
    );

    console.log(`Seeded ${insertedRoles.length} roles`);

    return {
      createTable,
      users: insertedRoles,
    };
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  }
}

async function seedPermissions(client) {
  try {
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS permissions (
      permissionname VARCHAR(50) NOT NULL PRIMARY KEY,
      UNIQUE (permissionname)
    );
  `;

    console.log(`Created "permissions" table`);

    const insertedPermissions = await Promise.all(
      permissions.map(
        async (permission) => client.sql`
        INSERT INTO permissions (permissionname)
        VALUES (${permission.permissionname})
      `,
      ),
    );

    console.log(`Seeded ${insertedPermissions.length} permissions`);

    return {
      createTable,
      permissions: insertedPermissions,
    };
  } catch (error) {
    console.error('Error seeding permissions:', error);
    throw error;
  }
}

async function seedRolesPermissions(client) {
  try {
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS rolesPermissions (
      role VARCHAR(50) NOT NULL,
      permission VARCHAR(50) NOT NULL,
      UNIQUE (role, permission),
      PRIMARY KEY (role, permission),
      FOREIGN KEY (role) REFERENCES roles(rolename),
      FOREIGN KEY (permission) REFERENCES permissions(permissionname)
    );
  `;

    console.log(`Created "rolesPermissions" table`);

    const insertedRolesPermissions = [];
    for (const role of roles) {
      const rolePermissionPromises = role.permissions.map(
        async (permission) => {
          return client.sql`
          INSERT INTO rolesPermissions (role, permission)
          VALUES (${role.rolename}, ${permission})
        `;
        },
      );

      const rolePermissions = await Promise.all(rolePermissionPromises);
      insertedRolesPermissions.push(...rolePermissions);
    }

    console.log(`Seeded ${insertedRolesPermissions.length} rolesPermissions`);

    return {
      createTable,
      rolesPermissions: insertedRolesPermissions,
    };
  } catch (error) {
    console.error('Error seeding rolesPermissions:', error);
    throw error;
  }
}

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        UNIQUE (id),
        UNIQUE (username),
        FOREIGN KEY (role) REFERENCES roles(rolename)
      );
    `;

    console.log(`Created "users" table`);

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return client.sql`
            INSERT INTO users (username, password, role)
            VALUES (${user.username}, ${hashedPassword}, ${user.role})
          `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedBooks(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS books (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        borrowerid UUID,
        requestid UUID,
        UNIQUE (id),
        FOREIGN KEY (borrowerid) REFERENCES users(id),
        FOREIGN KEY (requestid) REFERENCES requests(id)
      );
    `;

    console.log(`Created "books" table`);

    const insertedBooks = await Promise.all(
      books.map((book) => {
        if (book.borrowerid) {
          return client.sql`
              INSERT INTO books (title, author, borrowerid)
              VALUES (${book.title}, ${book.author}, ${book.borrowerid})
            `;
        } else {
          return client.sql`
              INSERT INTO books (title, author)
              VALUES (${book.title}, ${book.author})
            `;
        }
      }),
    );

    console.log(`Seeded ${insertedBooks.length} books`);

    return {
      createTable,
      books: insertedBooks,
    };
  } catch (error) {
    console.error('Error seeding books:', error);
    throw error;
  }
}

async function createLogs(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS logs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        permission VARCHAR(50) NOT NULL,
        userid UUID NOT NULL,
        UNIQUE (id),
        FOREIGN KEY (permission) REFERENCES permissions(permissionname),
        FOREIGN KEY (userid) REFERENCES users(id)
      );
    `;

    console.log(`Created "logs" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error creating logs table:', error);
    throw error;
  }
}

async function createRequests(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS requests (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        requestname VARCHAR(50) NOT NULL,
        userid UUID NOT NULL,
        bookid UUID NOT NULL,
        UNIQUE (id),
        FOREIGN KEY (userid) REFERENCES users(id),
        FOREIGN KEY (bookid) REFERENCES books(id)
      );
    `;

    console.log(`Created "requests" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error creating requests table:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  client.sql`TRUNCATE TABLE roles CASCADE;
    TRUNCATE TABLE permissions CASCADE;
    TRUNCATE TABLE rolesPermissions CASCADE;
    TRUNCATE TABLE users CASCADE;
    TRUNCATE TABLE logs CASCADE;
    TRUNCATE TABLE requests CASCADE;
    TRUNCATE TABLE books CASCADE;`;

  await seedRoles(client);
  await seedPermissions(client);
  await seedRolesPermissions(client);
  await seedUsers(client);
  // await seedBooks(client);
  await createLogs(client);
  await createRequests(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
