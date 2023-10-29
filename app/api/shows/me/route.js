import { NextResponse } from 'next/server';
import { getMyShows } from 'app/_utils/db/shows';

export async function POST(req) {
  const body = await req.json();
  const { userId } = body;
  const res = await getMyShows(userId);
  return NextResponse.json(res);
}
