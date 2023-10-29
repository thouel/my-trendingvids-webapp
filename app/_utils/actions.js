import { z } from 'zod';
import { getBaseUrl, isPinned } from './helper';

/**
 * Dead function. Used only to serve as template
 * of a ServerAction
 */
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
    const form = schema.parse({
      show: formData.get('show')?.toLowerCase(),
      showType: formData.get('showType'),
    });

    // const filePath = path.join(
    //   process.cwd(),
    //   `/app/(trends)/_data/trending_${data.showType}_week.json`
    // );
    // const byteData = await fs.readFile(filePath);
    // const jsonData = await JSON.parse(byteData);

    var results = await fetch(
      `http://localhost:3000/api/trends/${form.showType}`,
      {
        method: 'POST',
      },
    )
      .then((res) => res.json())
      .then((data) => data);

    if (form.show) {
      results = results.filter((r) => {
        const label = (r.title ? r.title : r.name).toLowerCase();
        return label.indexOf(form.show) > -1;
      });
    }
    // revalidatePath('/');
    return { message: 'Search OK', data: results };
  } catch (e) {
    console.error('exception', e);
    return { message: 'Search failed' };
  }
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

const fetchShow = async (showType, id, session) => {
  let resShow = null;
  let resErrorMessage = '';
  let resIsLoading = true;
  let resIsShowInMyList = false;
  const pinned = isPinned(showType);

  if (pinned && !session) {
    redirect('/');
  }

  if (pinned) {
    const { pinnedShows } = session.user;
    const one = pinnedShows.filter((ps) => ps.externalId === parseInt(id));
    resShow = one[0];
    resIsLoading = false;
  } else {
    const url = `${getBaseUrl()}/api/show/${showType}/${id}`;
    console.log('fetchShow', { url });

    await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(({ error, show }) => {
        resErrorMessage = error?.message ?? '';
        resShow = show;
      })
      .finally(() => {
        resIsLoading = false;
      });
  }
  resIsShowInMyList = pinned;

  const res = {
    show: resShow,
    isLoading: resIsLoading,
    errorMessage: resErrorMessage,
    isShowInMyList: resIsShowInMyList,
  };
  console.log('fetchShow res', { res });
  return res;
};

export { updateGenresToDisplay, fetchShow };
