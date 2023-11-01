import { NextResponse } from 'next/server';
import { getOne } from 'app/utils/db/users';

export async function GET(req, { params }) {
  const { email } = params;
  const res = await getOne(email);
  console.log('GET /user', { res });
  return NextResponse.json(res);
}
