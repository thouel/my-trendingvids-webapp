import { z } from 'zod';
import { getBaseUrl, isPinned } from './helper';
import { redirect } from 'next/navigation';

/**
 * Dead function. Used only to serve as template
 * of a ServerAction
 */
// eslint-disable-next-line no-unused-vars
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

const fetchShowsByType = async (session, showType, q) => {
  console.log('fetchShowsByType', { session, showType, q });

  var resShows = [];
  var resGenres = [];
  const pinned = isPinned(showType);
  var resError = null;
  var url = `${getBaseUrl()}/api/trends/${showType}`;

  console.log('Shows Component', { url });

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: session?.user.id }),
  })
    .then((res) => res.json())
    .then(async ({ error, shows }) => {
      if (error) {
        console.error('ERROR on API', error);
        resError = error;
        return;
      }
      // Filter the shows based on query string
      resShows = q
        ? shows.filter((s) => {
            const lowerQ = q.toLowerCase();
            const label = (s.title ?? s.name).toLowerCase();
            return label.indexOf(lowerQ) > -1;
          })
        : shows;
    });

  if (!resError && !pinned) {
    // Now fetch the genres to display shows by genres
    url = `${getBaseUrl()}/api/genres/${showType}`;
    console.log('Shows Component', { url });

    await fetch(url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then(({ error, genres }) => {
        if (error) {
          console.error('ERROR on API', error);
          resError = error;
          return;
        }
        resGenres = updateGenresToDisplay(resShows, genres);
        resGenres = resGenres.filter((g) => g.found === true);
      });
  }
  // console.log('fetchShowsByType', {
  //   shows: resShows,
  //   genres: resGenres,
  //   isPinned: pinned,
  // });
  return {
    shows: resShows,
    genres: resGenres,
    isPinned: pinned,
    error: resError,
  };
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

export { updateGenresToDisplay, fetchShowsByType, fetchShow };
