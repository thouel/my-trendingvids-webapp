import fsPromises from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  console.log(`POST api/trends/[${params.showType}]`);

  // Get the trendings
  const filePath = path.join(
    process.cwd(),
    `/app/(trends)/_data/trending_${params.showType}_week.json`
  );
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData);

  // Get the genre labels
  // const genrePath = path.join(
  //   process.cwd(),
  //   `/app/(trends)/_data/genres_${params.showType}.json`
  // );
  // const genreBytes = await fsPromises.readFile(genrePath);
  // const genreData = JSON.parse(genreBytes);

  var results = null;
  // if (genres == null || genres.length <= 0) {
  results = objectData.results;

  // Add the genre labels in genres[]
  // results.forEach((r) => {
  //   r.genres = [];
  //   r.genre_ids.forEach((g) => {
  //     r.genres.push({
  //       id: g,
  //       label: genreData.genres.filter((gd) => gd.id === g)[0].name,
  //     });
  //   });
  // });

  return NextResponse.json(results);
}
