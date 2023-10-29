import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { updateGenresToDisplay } from '@u/actions';
import ShowsCarousel from './ShowsCarousel';
import { getServerSession } from 'next-auth';
import { options } from 'app/api/auth/[...nextauth]/options';
import { isPinned, getBaseUrl } from '@u/helper';
import { redirect } from 'next/navigation';
import LambdaError from './LambdaError';

const getShowsByType = async (session, showType, q) => {
  console.log('getShowsByType', { session, showType, q });

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
  // console.log('getShowsByType', {
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

/**
 * The Shows Component
 * @param {showType}
 * @param {q} the Search Query
 * @returns
 */
export default async function Shows({ showType, q }) {
  const session = await getServerSession(options);
  const { shows, genres, isPinned, error } = await getShowsByType(
    session,
    showType,
    q,
  );

  if (error) {
    return <LambdaError />;
  }

  return (
    <>
      <div className='grid grid-flow-row grid-cols-4 gap-1 px-2 overflow-y-auto sm:px-0'>
        {isPinned ? (
          <Fragment>
            <span className='relative col-span-4 row-auto text-lg font-bold'>
              <ChevronRightIcon className='inline w-6 h-6 pb-1 mr-1' />
              My list
            </span>
            <ShowsCarousel
              genreLabel={'My list'}
              shows={shows}
              showType={showType}
            />
          </Fragment>
        ) : (
          genres.map((g) => (
            <Fragment key={g.id}>
              <span className='relative col-span-4 row-auto text-lg font-bold'>
                <ChevronRightIcon className='inline w-6 h-6 pb-1 mr-1' />
                {g.name}
              </span>
              <ShowsCarousel
                genreLabel={g.name}
                shows={shows.filter((s) => s.genre_ids.indexOf(g.id) > -1)}
                showType={showType}
              />
            </Fragment>
          ))
        )}
      </div>
    </>
  );
}
