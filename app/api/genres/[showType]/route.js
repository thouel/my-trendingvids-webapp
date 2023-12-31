import { NextResponse } from 'next/server';
import { removePrefixFromShowType } from 'app/utils/helper';

export async function GET(req, { params }) {
  try {
    var errorCode, errorMsg;
    var res = {};
    var { showType } = params;
    showType = removePrefixFromShowType(showType);
    const st = showType === 'movies' ? 'movie' : 'tv';
    const url = `https://api.themoviedb.org/3/genre/${st}/list?language=en`;
    res = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return { genres: data.genres };
      });
  } catch (e) {
    errorCode = e.code;
    errorMsg = e.message;
  }

  if (errorCode || errorMsg) {
    res.error = { code: errorCode, message: errorMsg };
  }
  console.log('END GET /api/genres/' + params.showType /* , { res } */);
  return NextResponse.json(res, { status: errorMsg ? 400 : 200 });
}
