import { NextResponse } from 'next/server';
import { getOneById, removeShowFromMyListByExternalId } from '@/db/shows';

/**
 * @param req the request
 * @param params.id the mongo id of the show to get
 */
export async function GET(req, { params }) {
  const res = await getOneById(params.id);
  return NextResponse.json(res);
}

/**
 * @param req the request
 * @param params.id the externalId of the show to delete
 */
export async function DELETE(req, { params }) {
  const body = await req.json();
  const { userId } = body;
  const res = await removeShowFromMyListByExternalId(params.id, userId);
  console.log('DELETE', { res });
  return NextResponse.json(res);
}
