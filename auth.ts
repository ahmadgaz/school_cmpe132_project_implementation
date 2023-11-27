import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { UserType } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function getUser(email: string): Promise<UserType | undefined> {
  try {
    const user = await sql<UserType>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user.');
  }
}

export const signIn = async (credentials: UserType) => {
  try {
    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
      })
      .safeParse(credentials);
    if (!parsedCredentials.success) throw new Error('Invalid credentials!');

    const { email, password } = parsedCredentials.data;
    const user = await getUser(email);
    if (!user) throw new Error('User does not exist!');

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) throw new Error('Invalid credentials!');

    const jti = await bcrypt.genSalt();
    const token = jwt.sign(
      { id: user.id, name: user.name, email, jti },
      String(process.env.AUTH_SECRET),
    );

    return token;
  } catch (error) {
    console.error(error);
    throw error as Error;
  }
};
