import path from 'path';
import { promises as fs } from 'fs';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

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

    // const filePath = path.join(
    //   process.cwd(),
    //   `/app/(trends)/_data/trending_${data.showType}_week.json`
    // );
    // const byteData = await fs.readFile(filePath);
    // const jsonData = await JSON.parse(byteData);
    let results = null;
    await fetch(`http://localhost:3000/api/trends/${data.showType}`, {
      method: 'post',
    })
      .then((res) => res.json())
      .then((data) => (results = data));

    if (data.show) {
      results = results.filter((r) => {
        const label = (r.title ? r.title : r.name).toLowerCase();
        return label.indexOf(data.show) > -1;
      });
    }
    // revalidatePath('/');
    return { message: 'Search OK', data: results };
  } catch (e) {
    console.error('exception', e);
    return { message: 'Search failed' };
  }
}

async function fetchGenres(pShows, pShowType) {
  if (pShowType === undefined || pShowType === 'all') return;
  console.log('fetch genres ', pShowType);

  return await fetch(`/api/genres/${pShowType}`, { method: 'GET' })
    .then((res) => res.json())
    .then((data) => {
      return updateGenresToDisplay(pShows, data.genres);
    });
}

const updateGenresToDisplay = (pShows, pGenres) => {
  if (pGenres === undefined || pGenres.length == 0) return pGenres;
  if (pShows === undefined || pShows.length == 0) return pGenres;

  // Reinit genres.found
  pGenres.forEach((g) => {
    g.found = false;
  });

  pShows.forEach((s) => {
    s.genre_ids.forEach((gi) => {
      pGenres.filter((g) => gi === g.id)[0].found = true;
    });
  });
  return pGenres;
};

export { searchShows, fetchGenres, updateGenresToDisplay };
