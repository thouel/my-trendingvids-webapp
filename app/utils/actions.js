import { z } from 'zod';
import { areMyShowsRequested, getBaseUrl, isShowInMyList } from './helper';
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

const fetchShowsByType = async ({ queryKey }) => {
  const { showType, q, session } = queryKey[1];
  var resShows = [];
  var resGenres = [];
  const myShowsAreRequested = areMyShowsRequested(showType);
  var resError = null;
  var url = `${getBaseUrl()}/api/trends/${showType}`;

  console.log('fetchShowsByType', { url });

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: session?.user.id }),
  })
    .then((res) => res.json())
    .then(async ({ error, shows }) => {
      if (error) {
        console.error('ERROR on API', error);
        throw new Error(error);
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

  if (!resError && !myShowsAreRequested) {
    // Now fetch the genres to display shows by genres
    url = `${getBaseUrl()}/api/genres/${showType}`;

    await fetch(url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then(({ error, genres }) => {
        if (error) {
          console.error('ERROR on API', error);
          throw new Error(error);
        }
        resGenres = updateGenresToDisplay(resShows, genres);
        resGenres = resGenres.filter((g) => g.found === true);
      });
  }
  return {
    shows: resShows,
    genres: resGenres,
    isPinned: myShowsAreRequested,
  };
};

const fetchShow = async (showType, id, session) => {
  let resShow = null;
  let resErrorMessage = '';
  let resIsLoading = true;
  let resIsShowInMyList = false;
  const myShowsAreRequested = areMyShowsRequested(showType);
  const thisShowIsInMyList = isShowInMyList(id, session);

  if (myShowsAreRequested && !session) {
    redirect('/');
  }

  if (myShowsAreRequested) {
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
  resIsShowInMyList = myShowsAreRequested || thisShowIsInMyList;
  console.log('shows boolean', { myShowsAreRequested, thisShowIsInMyList });
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
