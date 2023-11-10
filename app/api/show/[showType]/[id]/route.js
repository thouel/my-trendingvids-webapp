import { NextResponse } from 'next/server';
import { ShowDB } from 'app/utils/db/ShowDB';
import { ShowTMDB } from 'app/utils/tmdb/ShowTMDB';

/**
 * @param req the request
 * @param params.id the mongo id of the show to get
 */
export async function GET(req, { params }) {
  const { showType, id: externalId } = params;
  const res = await ShowTMDB().get(showType, externalId);
  console.log(`GET /api/show/${showType}/${externalId}`, { res });
  return NextResponse.json(res, { status: res.error?.message ? 400 : 200 });
}

/**
 * @param req the request
 * @param params.id the externalId of the show to delete
 */
export async function DELETE(req, { params }) {
  const body = await req.json();
  const { userId } = body;
  const { id: showId } = params;
  const res = await ShowDB().remove(showId, userId);
  console.log(`DELETE /api/show/${params.showType}/${showId}`, { res });
  return NextResponse.json(res, { status: res.error?.message ? 400 : 200 });
}
