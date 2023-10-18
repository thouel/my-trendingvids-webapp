import { NextResponse } from 'next/server';
import prisma from '@/db/db-prisma';
import { isPinned } from '@/utils/helper';
require('@/utils/db/bigint-tojson');

export async function POST(req, { params }) {
  var errorCode;
  var errorMsg;
  var res = {};
  try {
    const body = await req.json();
    const { userId } = body;
    const { showType } = params;

    const pinned = isPinned(showType);

    if (pinned) {
      const doc = await prisma.show.findMany({
        where: {
          userIDs: {
            has: userId,
          },
        },
      });
      console.log('prisma shows:', doc);
      res = { shows: doc };
    } else {
      const st = showType === 'movies' ? 'movie' : 'tv';
      const url = `https://api.themoviedb.org/3/trending/${st}/week?language=en-EN`;
      console.log(`POST /trends/${showType} url`, { url });
      res = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          return { shows: data.results };
        });
    }
  } catch (e) {
    errorCode = e.code;
    errorMsg = e.message;
  }

  if (errorCode || errorMsg) {
    res.error = { code: errorCode, message: errorMsg };
  }
  console.log(`POST /trends/${params.showType}`, { res });
  return NextResponse.json(res);
}
