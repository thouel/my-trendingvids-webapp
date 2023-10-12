import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { createEdgeRouter } from 'next-connect';
import prisma from '@/db/db-prisma';
import { isPinned } from '@/utils/helper';

const router = createEdgeRouter /* <NextApiRequest, NextApiResponse> */();

router
  .post(async (req, ctx, next) => {
    try {
      const { showType } = ctx.params;
      const body = await req.json();
      const { userId } = body;
      console.log('trends/showtype', { userId, showType });
      const pinned = isPinned(showType);
      if (pinned) {
        let doc = await prisma.show.findMany({
          where: {
            userIDs: {
              has: token.id,
            },
          },
        });
        // let doc = await req.dbClient.collection('pinned').findOne();
        console.log('prisma shows:', doc);
        return NextResponse.json(doc);
      } else {
        // Get the trendings
        const filePath = path.join(
          process.cwd(),
          `/app/(trends)/_data/trending_${showType}_week.json`
        );

        const jsonData = await fs.readFile(filePath);
        const objectData = JSON.parse(jsonData);

        return NextResponse.json(objectData.results);
      }
    } catch (e) {
      console.error('ERROR', e);
    }
    return NextResponse.json({ message: 'ERROR occured' });
  })
  /* .use(closeDatabase) */
  .handler({
    onError: (err, req, res) => {
      console.error(err.stack);
      return NextResponse.statusCode(err.statusCode || 500).end(err.message);
    },
  });

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
      res.shows = doc;
    } else {
      // Get the trendings from TMDB
      const filePath = path.join(
        process.cwd(),
        `/app/(trends)/_data/trending_${showType}_week.json`
      );

      const jsonData = await fs.readFile(filePath);
      const objectData = JSON.parse(jsonData);

      res.shows = objectData.results;
    }
  } catch (e) {
    errorCode = e.code;
    errorMsg = e.message;
  }

  if (errorCode || errorMsg) {
    res.error = { code: errorCode, message: errorMsg };
  }
  return NextResponse.json(res);
}
