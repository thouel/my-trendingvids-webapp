import { NextResponse } from 'next/server';
import { removeShowFromMyListByExternalId } from 'app/utils/db/shows';

/**
 * @param req the request
 * @param params.id the mongo id of the show to get
 */
export async function GET(req, { params }) {
  const { showType, id } = params;

  const st = showType === 'movies' ? 'movie' : 'tv';
  const url = `https://api.themoviedb.org/3/${st}/${params.id}?language=en-EN&append_to_response=external_ids`;
  console.log(`/show/${st}/${id} url`, { url });

  var errorMsg;
  var res = {};

  await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.success != undefined && json.success === false) {
        throw Error(json.status_message);
      }
      res.show = json;
    })
    .catch((e) => {
      errorMsg = e.message;
    });

  if (errorMsg) {
    res.error = { message: errorMsg };
  }
  console.log(`GET /api/show/${st}/${id}`, { res });
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
  const res = await removeShowFromMyListByExternalId(showId, userId);
  console.log(`DELETE /api/show/${params.showType}/${showId}`, { res });
  return NextResponse.json(res, { status: res.error?.message ? 400 : 200 });
}
