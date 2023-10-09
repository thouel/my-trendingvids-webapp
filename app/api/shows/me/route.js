import { NextResponse } from 'next/server';
import { getMyShows } from '@/db/shows';
import { getServerSession } from 'next-auth/next';
import { options } from 'app/api/auth/[...nextauth]/options';

export async function POST(req) {
  const body = await req.json();
  const { userId } = body;
  const res = await getMyShows(userId);
  return NextResponse.json(res);
}
