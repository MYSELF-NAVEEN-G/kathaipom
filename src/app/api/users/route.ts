import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/data';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to read user data in /api/users:', error);
    return NextResponse.json({ error: 'Failed to read user data' }, { status: 500 });
  }
}
