import { NextResponse } from 'next/server';
import { readUsersFromFile } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { username, password, isAdmin } = await request.json();
    const users = await readUsersFromFile();

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // If it's an admin login, check if the user is actually an admin
    if (isAdmin && !user.isAdmin) {
        return NextResponse.json({ message: 'This account does not have writer privileges.' }, { status: 403 });
    }

    // Don't send the password back to the client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
