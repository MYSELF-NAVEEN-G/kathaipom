import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/data';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read user data' }, { status: 500 });
  }
}
