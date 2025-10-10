import { NextResponse } from 'next/server';
import { readUsersFromFile } from '@/lib/data';

export async function GET() {
  try {
    const users = await readUsersFromFile();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to read users:', error);
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}
