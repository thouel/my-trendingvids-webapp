import { NextResponse } from 'next/server';
import { getOrUpsertOne } from '@/db/users';

export async function POST(req) {
  const body = await req.json();
  const { user } = body;
  const res = await getOrUpsertOne(user);
  console.dir(res);
  return NextResponse.json(res);
}
