'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BookType, RequestType, UserAuthType, UserType } from './definitions';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';
import queries from './queries';
import bcrypt from 'bcrypt';
import api from './api';

type NeonDbError = {
  code: string;
  sourceError: string;
};

const UserAuthSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
  role: z.union([z.literal('USER'), z.literal('ADMIN')]),
});

const UserAuth = UserAuthSchema.omit({ id: true, role: true });

async function getUser(username: string): Promise<UserAuthType | undefined> {
  try {
    return await api.fetchUserByUsername(username);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user.');
  }
}

export const signIn = async (
  credentials: Omit<UserAuthType, 'id' | 'role'>,
) => {
  try {
    const { username, password } = credentials;
    const user = await getUser(username);
    if (!user) throw new Error('User does not exist!');

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) throw new Error('Invalid credentials!');

    const jti = crypto.randomUUID();
    const token = jwt.sign(
      { id: user.id, role: user.role, username, jti },
      String(process.env.AUTH_SECRET),
    );

    return token;
  } catch (error) {
    console.error(error);
    throw error as Error;
  }
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  let token;
  try {
    const validatedFields = UserAuth.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success)
      throw new Error(
        validatedFields.error.errors.map((error) => error.message).join('\n'),
      );

    token = await signIn(
      validatedFields.data as Omit<UserAuthType, 'id' | 'role'>,
    );
  } catch (error) {
    console.error(error);
    return String(error) || 'Failed to sign in.';
  }
  cookies().set({
    name: '_session',
    value: token,
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
  });
  redirect('/books');
}

async function queryHelper<Arguments, ReturnValue>(
  queries: {
    args: Arguments;
    guestQuery?: (args: Arguments) => Promise<ReturnValue>;
    userQuery?: (args: Arguments, user: UserType) => Promise<ReturnValue>;
    adminQuery?: (args: Arguments, user: UserType) => Promise<ReturnValue>;
  },
  token?: string,
) {
  try {
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

const BookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  borrowerid: z.string().uuid().nullable(),
  requestid: z.string().uuid().nullable(),
});

const CreateBook = BookSchema.omit({
  id: true,
  borrowerid: true,
  requestid: true,
});

export async function createBook(formData: FormData, token?: string) {
  try {
    const validatedFields = CreateBook.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success)
      throw new Error(
        validatedFields.error.errors.map((error) => error.message).join('\n'),
      );

    await queryHelper<{ validatedFields: Omit<BookType, 'id'> }, void>(
      {
        args: { validatedFields: validatedFields.data },
        adminQuery: async function (args, user) {
          await queries.admin.createBook(args.validatedFields, user);
        },
      },
      token,
    );
  } catch (error) {
    console.error('Database Error:', error);
    return String(error) || 'Failed to add book.';
  }
  revalidatePath('/logs');
  revalidatePath('/catalog');
  redirect('/catalog');
}

const UpdateBook = BookSchema.omit({
  borrowerid: true,
  requestid: true,
});

export async function updateBook(formData: FormData, token?: string) {
  try {
    const validatedFields = UpdateBook.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success)
      throw new Error(
        validatedFields.error.errors.map((error) => error.message).join('\n'),
      );

    await queryHelper<{ validatedFields: BookType }, void>(
      {
        args: { validatedFields: validatedFields.data as BookType },
        adminQuery: async function (args, user) {
          await queries.admin.updateBook(args.validatedFields, user);
        },
      },
      token,
    );
  } catch (error) {
    console.error('Database Error:', error);
    return String(error) || 'Failed to update book.';
  }
  revalidatePath('/logs');
  revalidatePath('/books');
  revalidatePath('/requests');
  revalidatePath('/catalog');
  redirect('/catalog');
}

export async function deleteBook(id: string, token?: string) {
  try {
    await queryHelper<{ id: string }, void>(
      {
        args: { id },
        adminQuery: async function (args, user) {
          await queries.admin.deleteBook(args.id, user);
        },
      },
      token,
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw (error as Error).message || 'Failed to delete book.';
  }
  revalidatePath('/logs');
  revalidatePath('/books');
  revalidatePath('/requests');
  revalidatePath('/catalog');
  redirect('/catalog');
}

export async function saveRequest(book: BookType, token?: string) {
  try {
    await queryHelper<{ book: BookType }, void>(
      {
        args: { book },
        userQuery: async function (args, user) {
          await queries.userOrAdmin.saveRequest(args.book, user);
        },
        adminQuery: async function (args, user) {
          await queries.userOrAdmin.saveRequest(args.book, user);
        },
      },
      token,
    );
  } catch (error) {
    console.error(error);
    throw String(error) || 'Failed to save request.';
  }
  revalidatePath('/logs');
  revalidatePath('/catalog');
  revalidatePath('/requests');
  revalidatePath('/requests');
}

const UpdateProfile = UserAuthSchema.omit({ id: true, role: true })
  .extend({ confirmPassword: z.string().min(1).max(255) })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
      });
    }
  });

export async function updateProfile(formData: FormData, token?: string) {
  try {
    const validatedFields = UpdateProfile.safeParse(
      Object.fromEntries(formData),
    );
    if (!validatedFields.success)
      throw new Error(
        validatedFields.error.errors.map((error) => error.message).join('\n'),
      );
    await queryHelper<
      {
        validatedFields: Omit<UserAuthType, 'id' | 'role'> & {
          confirmPassword: string;
        };
      },
      void
    >(
      {
        args: { validatedFields: validatedFields.data },
        userQuery: async function (args, user) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(
            args.validatedFields.password,
            salt,
          );
          await queries.user.updateProfile({
            id: user.id,
            username: args.validatedFields.username,
            password: hashedPassword,
            role: user.role,
          });
        },
      },
      token,
    );
  } catch (error) {
    console.error('Database Error:', error);
    return String(error) || 'Failed to update user.';
  }
  revalidatePath('/logs');
  revalidatePath('/profile');
  revalidatePath('/users');
  revalidatePath('/catalog');
  revalidatePath('/requests');
  revalidatePath('/books');
}

const AddUser = UserAuthSchema.omit({ id: true })
  .extend({ confirmPassword: z.string().min(1).max(255) })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
      });
    }
  });

export async function addUser(formData: FormData, token?: string) {
  let role;
  let user;
  try {
    if (typeof formData.get('role') !== 'string') {
      formData.set('role', 'USER');
    }
    const validatedFields = AddUser.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success)
      throw new Error(
        validatedFields.error.errors.map((error) => error.message).join('\n'),
      );
    role = await queryHelper<
      {
        validatedFields: Omit<UserAuthType, 'id'> & {
          confirmPassword: string;
        };
      },
      string
    >(
      {
        args: { validatedFields: validatedFields.data },
        guestQuery: async function (args) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(
            args.validatedFields.password,
            salt,
          );
          await queries.guest.register(
            args.validatedFields.username,
            hashedPassword,
          );
          user = {
            username: args.validatedFields.username,
            password: args.validatedFields.password,
          };
          return 'USER';
        },
        adminQuery: async function (args, user) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(
            args.validatedFields.password,
            salt,
          );
          await queries.admin.addUser(
            user,
            args.validatedFields.username,
            hashedPassword,
            args.validatedFields.role,
          );
          return user.role;
        },
      },
      token,
    );
  } catch (error) {
    console.error('Database Error:', error);
    if ((error as NeonDbError).code === '23505')
      return 'Username already exists.';
    else return String(error) || 'Failed to add user.';
  }
  if (role === 'ADMIN') {
    revalidatePath('/logs');
    revalidatePath('/users');
    redirect('/users');
  } else {
    if (user) {
      const token = await signIn(user as Omit<UserAuthType, 'id' | 'role'>);
      cookies().set({
        name: '_session',
        value: token,
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
      });
    }
    redirect('/books');
  }
}

export async function deleteUser(id: string, token?: string) {
  let role;
  try {
    role = await queryHelper<{ id: string }, string>(
      {
        args: { id },
        userQuery: async function (args, user) {
          await queries.user.deleteProfile(args.id, user);
          return user.role;
        },
        adminQuery: async function (args, user) {
          if (user.id === args.id)
            throw new Error('You cannot delete yourself.');
          await queries.admin.deleteUser(args.id, user);
          return user.role;
        },
      },
      token,
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw String(error) || 'Failed to delete user.';
  }
  if (role === 'ADMIN') {
    revalidatePath('/logs');
    revalidatePath('/requests');
    revalidatePath('/catalog');
    revalidatePath('/users');
    redirect('/users');
  } else {
    cookies().delete('_session');
    redirect('/');
  }
}

export async function acceptRequest(request: RequestType, token?: string) {
  try {
    await queryHelper<{ request: RequestType }, void>(
      {
        args: { request },
        adminQuery: async function (args, user) {
          await queries.admin.acceptRequest(args.request, user);
        },
      },
      token,
    );
  } catch (error) {
    console.error(error);
    throw String(error) || 'Failed to accept request.';
  }
  revalidatePath('/logs');
  revalidatePath('/requests');
  revalidatePath('/catalog');
  revalidatePath('/books');
  redirect('/requests');
}

export async function denyRequest(request: RequestType, token?: string) {
  try {
    await queryHelper<{ request: RequestType }, void>(
      {
        args: { request },
        adminQuery: async function (args, user) {
          await queries.admin.denyRequest(args.request, user);
        },
      },
      token,
    );
  } catch (error) {
    console.error(error);
    throw String(error) || 'Failed to reject request.';
  }
  revalidatePath('/logs');
  revalidatePath('/requests');
  revalidatePath('/catalog');
  revalidatePath('/books');
  redirect('/requests');
}
