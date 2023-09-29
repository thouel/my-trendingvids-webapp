'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import fsPromises from 'fs/promises';
import path from 'path';

async function searchShows(prevState, formData) {
  const showSchema = z
    .string()
    .min(3)
    .optional()
    .or(z.literal(''))
    .transform((e) => (e === '' ? undefined : e));

  const schema = z.object({
    show: showSchema,
    showType: z.enum(['movies', 'tvshows']),
  });

  try {
    const data = schema.parse({
      show: formData.get('show')?.toLowerCase(),
      showType: formData.get('showType'),
    });

    const filePath = path.join(
      process.cwd(),
      `/app/(trends)/_data/trending_${data.showType}_week.json`
    );
    const byteData = await fsPromises.readFile(filePath);
    const jsonData = await JSON.parse(byteData);

    let results = jsonData.results;
    if (data.show) {
      results = jsonData.results.filter((r) => {
        const label = (r.title ? r.title : r.name).toLowerCase();
        return label.indexOf(data.show) > -1;
      });
    }
    revalidatePath('/');
    return { message: 'Search OK', data: results };
  } catch (e) {
    console.error('exception', e);
    return { message: 'Search failed' };
  }
}

async function fetchGenres(showType) {
  if (showType === undefined || showType === 'all') return;
  console.log('fetch genres ', showType);

  fetch(`/api/genres/${showType}`, { method: 'GET' })
    .then((res) => res.json())
    .then((data) => {
      return data.genres;
    });
}

export { searchShows, fetchGenres };
