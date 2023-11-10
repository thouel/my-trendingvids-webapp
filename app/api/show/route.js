import { NextResponse } from 'next/server';
import { ShowDB } from 'app/utils/db/ShowDB';

export async function POST(req) {
  const body = await req.json();
  const { show, user } = body;
  const res = await ShowDB().saveOrUpdate(show, user);
  console.log('POST /show', { res });
  return NextResponse.json(res, { status: res?.error?.message ? 400 : 200 });
}
