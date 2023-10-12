import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { error } from 'console';
import { isPinned } from '@/utils/helper';

export async function GET(req, { params }) {
  try {
    var { showType } = params;
    if (isPinned(showType)) {
      showType = showType.substring(2);
    }
    const filePath = path.join(
      process.cwd(),
      `/app/(trends)/_data/genres_${showType}.json`
    );
    const jsonData = await fs.readFile(filePath);
    const objectData = JSON.parse(jsonData);
    return NextResponse.json(objectData);
  } catch (e) {
    console.log(e.message);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
