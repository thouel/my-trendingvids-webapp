import { NextResponse } from 'next/server';
import { saveOrUpdateOne } from '@/db/shows';

export async function POST(req) {
  const body = await req.json();
  const { show, user } = body;
  const res = await saveOrUpdateOne(show, user);
  return NextResponse.json(res);
}
