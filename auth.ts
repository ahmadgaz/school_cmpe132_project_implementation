import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { UserAuthType } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function getUser(username: string): Promise<UserAuthType | undefined> {
  try {
    const user =
      await sql<UserAuthType>`SELECT * FROM users WHERE username=${username}`;
    return user.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user.');
  }
}

export const signIn = async (credentials: UserAuthType) => {
  try {
    const parsedCredentials = z
      .object({
        username: z.string(),
        password: z.string().min(6),
      })
      .safeParse(credentials);
    if (!parsedCredentials.success) throw new Error('Invalid credentials!');

    const { username, password } = parsedCredentials.data;
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
