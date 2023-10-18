import { NextResponse } from 'next/server';
import { removeShowFromMyListByExternalId } from '@/db/shows';

/**
 * @param req the request
 * @param params.id the mongo id of the show to get
 */
export async function GET(req, { params }) {
  const { showType, id } = params;

  const st = showType === 'movies' ? 'movie' : 'tv';
  const url = `https://api.themoviedb.org/3/${st}/${params.id}?language=en-EN&append_to_response=external_ids`;
  console.log(`/show/${st}/${id} url`, { url });

  var errorCode, errorMsg;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      errorCode = e.code;
      errorMsg = e.message;
    });

  if (errorCode || errorMsg) {
    res.error = { code: errorCode, message: errorMsg };
  }
  console.log(`GET /show/${st}/${id}`, { res });
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
  console.log(`DELETE /show/${params.showType}/${params.id}`, { res });
  return NextResponse.json(res);
}
