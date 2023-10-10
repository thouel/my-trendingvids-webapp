'use server';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { updateGenresToDisplay } from '@/utils/actions';
import ShowsCarousel from './ShowsCarousel';
import { getServerSession } from 'next-auth';
import { options } from 'app/api/auth/[...nextauth]/options';

const getShowsByType = async (session, showType, q) => {
  console.log('getShowsByType', { session, showType, q });
  var shows = [];
  var genres = [];
  const isPinned = showType.indexOf('p-') > -1;
  await fetch(`http://localhost:3000/api/trends/${showType}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: session?.user.id }),
  })
    .then((res) => res.json())
    .then(async (pShows) => {
      // Filter the shows based on query string
      shows = q
        ? pShows.filter((s) => {
            const lowerQ = q.toLowerCase();
            const label = (s.title ?? s.name).toLowerCase();
            return label.indexOf(lowerQ) > -1;
          })
        : pShows;
    });

  if (!isPinned) {
    // Now fetch the genres to display shows by genres
    await fetch(`http://localhost:3000/api/genres/${showType}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        genres = updateGenresToDisplay(shows, data.genres);
        genres = genres.filter((g) => g.found === true);
      });
  }

  return {
    shows: shows,
    genres: genres,
    isPinned: isPinned,
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
  const { shows, genres, isPinned } = await getShowsByType(
    session,
    showType,
    q
  );

  return (
    <>
      <div className='grid grid-flow-row grid-cols-4 gap-1 mt-4'>
        {isPinned ? (
          <Fragment>
            <span className='col-span-4 row-auto relative text-lg font-bold'>
              <ChevronRightIcon className='w-6 h-6 inline pb-1 mr-1' />
              My list
            </span>
            <ShowsCarousel genreLabel={'My list'} shows={shows} />
          </Fragment>
        ) : (
          genres.map((g) => (
            <Fragment key={g.id}>
              <span className='col-span-4 row-auto relative text-lg font-bold'>
                <ChevronRightIcon className='w-6 h-6 inline pb-1 mr-1' />
                {g.name}
              </span>
              <ShowsCarousel
                genreLabel={g.name}
                shows={shows.filter((s) => s.genre_ids.indexOf(g.id) > -1)}
              />
            </Fragment>
          ))
        )}
      </div>
    </>
  );
}
