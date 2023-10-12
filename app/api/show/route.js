import { NextResponse } from 'next/server';
import { saveOrUpdateOne } from '@/db/shows';

export async function POST(req) {
  const body = await req.json();
  const { show, user } = body;
  console.log('show', show);
  console.log('user', user);
  const res = await saveOrUpdateOne(show, user);
  return NextResponse.json(res);
}
