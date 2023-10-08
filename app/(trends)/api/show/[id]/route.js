import { NextResponse } from 'next/server';
import { getOneById } from '@/db/shows';

export async function GET(req, { params }) {
  const res = await getOneById(params.id);
  return NextResponse.json(res);
}
