import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { error } from 'console';

export async function GET(req, { params }) {
  try {
    const filePath = path.join(
      process.cwd(),
      `/app/(trends)/_data/genres_${params.showType}.json`
    );
    const jsonData = await fs.readFile(filePath);
    const objectData = JSON.parse(jsonData);
    return NextResponse.json(objectData);
  } catch (e) {
    console.error('GET genres[', params.showType, '] ERROR:', e);
    return undefined;
  }
}
