'use server';
import { cookies } from 'next/headers';
import { getUserById } from './data';

export async function auth() {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return { user: null };
  }

  const user = await getUserById(userId);

  return { user };
}
