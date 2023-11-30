'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BookType, UserAuthType, UserType } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { signIn } from '@/auth';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import queries from './queries';

const UserAuthSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
  role: z.union([z.literal('USER'), z.literal('ADMIN')]),
});

const UserAuth = UserAuthSchema.omit({ id: true, role: true });

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  let token;
  try {
    const validatedFields = UserAuth.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success)
      throw new Error(
        Object.values(validatedFields.error.flatten().fieldErrors).join('\n'),
      );

    token = await signIn(validatedFields.data as UserAuthType);
  } catch (error) {
    console.error(error);
    return (error as Error).message ?? 'Failed to sign in.';
  }
  redirect('/book/?token=' + token);
}

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

export async function createBook(
  prevState: string | undefined,
  formData: FormData,
) {
  noStore();
  try {
    const validatedFields = CreateBook.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success)
      throw new Error(
        Object.values(validatedFields.error.flatten().fieldErrors).join('\n'),
      );

    await queryHelper<{ validatedFields: BookType }, void>({
      args: { validatedFields: validatedFields.data as BookType },
      adminQuery: async function (args, user) {
        await queries.admin.createBook(args.validatedFields, user);
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return (error as Error).message ?? 'Failed to add book.';
  }
  revalidatePath('/logs');
  revalidatePath('/catalog');
  redirect('/catalog');
}

const UpdateBook = BookSchema.omit({
  borrowerid: true,
  requestid: true,
});

export async function updateBook(
  prevState: string | undefined,
  formData: FormData,
) {
  noStore();
  try {
    const validatedFields = UpdateBook.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success)
      throw new Error(
        Object.values(validatedFields.error.flatten().fieldErrors).join('\n'),
      );

    await queryHelper<{ validatedFields: BookType }, void>({
      args: { validatedFields: validatedFields.data as BookType },
      adminQuery: async function (args, user) {
        await queries.admin.editBook(args.validatedFields, user);
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return (error as Error).message ?? 'Failed to add book.';
  }
  revalidatePath('/logs');
  revalidatePath('/catalog');
  redirect('/catalog');
}

export async function saveRequest(book: BookType) {
  noStore();
  try {
    await queryHelper<{ book: BookType }, void>({
      args: { book },
      userQuery: async function (args, user) {
        await queries.userOrAdmin.saveRequest(args.book, user);
      },
      adminQuery: async function (args, user) {
        await queries.userOrAdmin.saveRequest(args.book, user);
      },
    });
  } catch (error) {
    console.error(error);
    return (error as Error).message ?? 'Failed to save request.';
  }
  revalidatePath('/logs');
  revalidatePath('/catalog');
}

// const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// export async function updateInvoice(id: string, formData: FormData) {
//   const { customerId, amount, status } = UpdateInvoice.parse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   const amountInCents = amount * 100;

//   await sql`
//         UPDATE invoices
//         SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
//         WHERE id = ${id}
//     `;

//   revalidatePath('/dashboard/invoices');
//   redirect('/dashboard/invoices');
// }

// export async function deleteInvoice(id: string) {
//   throw new Error('Failed to Delete Invoice');

//   // Unreachable code block
//   try {
//     await sql`DELETE FROM invoices WHERE id = ${id}`;
//     revalidatePath('/dashboard/invoices');
//     return { message: 'Deleted Invoice' };
//   } catch (error) {
//     return { message: 'Database Error: Failed to Delete Invoice' };
//   }
// }
