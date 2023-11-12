import { NextResponse } from 'next/server';
import { areMyShowsRequested } from 'app/utils/helper';
import { ShowDB } from 'app/utils/db/ShowDB';
import { ShowTMDB } from 'app/utils/tmdb/ShowTMDB';
require('app/utils/db/bigint-tojson');

export async function POST(req, { params }) {
  var res = {};
  var body;
  var userId;

  try {
    body = await req.json();
    userId = body.userId;
  } catch (e) {
    // if we are here, there is no userId to extract
    userId = null;
  }
  const { showType } = params;
  const myShowsAreRequested = areMyShowsRequested(showType);

  if (myShowsAreRequested && !userId) {
    res.error = { message: 'User not provided' };
  } else if (myShowsAreRequested) {
    res = await ShowDB().findManyByUser(userId);
  } else {
    res = await ShowTMDB().fetchMany(showType);
  }

  console.log(`END POST /api/trends/${params.showType}`, { res });
  return NextResponse.json(res, { status: res.error?.message ? 400 : 200 });
}
