import fsPromises from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const filePath = path.join(
    process.cwd(),
    `/app/(trends)/_data/genres_${params.showType}.json`
  );
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData);
  console.log(`GET genres/[${params.showType}]`);
  return NextResponse.json(objectData);
}
