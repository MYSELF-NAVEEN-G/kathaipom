// This file is no longer needed with Supabase and can be removed.
// For now, returning an empty array to prevent errors if it's still being called.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([]);
}
