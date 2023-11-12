import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from 'app/api/auth/[...nextauth]/options';
import { UserDB } from 'app/utils/db/UserDB';

export async function GET() {
  const session = await getServerSession(options);
  console.log('session', { session });
  if (!session || !session.user) {
    return NextResponse.json({ error: { message: 'Not logged in' } }, 400);
  }
  const res = { user: session.user };
  const u = await UserDB().get(res.user.email);
  console.log('GET /user/me', { u }, { res });
  return NextResponse.json(res, { status: 200 });
}
