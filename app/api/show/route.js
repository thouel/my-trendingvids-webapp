import { NextResponse } from 'next/server';
import { saveOrUpdateOne } from 'app/utils/db/shows';

export async function POST(req) {
  const body = await req.json();
  const { show, user } = body;
  const res = await saveOrUpdateOne(show, user);
  console.log('POST /show', { res });
  return NextResponse.json(res);
}
