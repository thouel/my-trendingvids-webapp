import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { createEdgeRouter } from 'next-connect';
import { getDatabase, closeDatabase } from '@/utils/db';

const router = createEdgeRouter /* <NextApiRequest, NextApiResponse> */();

router
  .use(getDatabase)
  .post(async (req, ctx, next) => {
    try {
      const { showType } = ctx.params;
      const isPinned = showType.indexOf('p-') > -1;
      if (isPinned) {
        let doc = await req.dbClient.collection('pinned').findOne();
        console.log(doc);
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
      throw e;
    }
  })
  /* .use(closeDatabase) */
  .handler({
    onError: (err, req, res) => {
      console.error(err.stack);
      return NextResponse.statusCode(err.statusCode || 500).end(err.message);
    },
  });

export async function POST(req, ctx /* :{ params } */) {
  return router.run(req, ctx);
}
