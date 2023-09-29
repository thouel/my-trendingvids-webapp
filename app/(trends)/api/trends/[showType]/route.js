import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  // Get the trendings
  const filePath = path.join(
    process.cwd(),
    `/app/(trends)/_data/trending_${params.showType}_week.json`
  );

  const jsonData = await fs.readFile(filePath);
  const objectData = JSON.parse(jsonData);

  return NextResponse.json(objectData.results);
}
