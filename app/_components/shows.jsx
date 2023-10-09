'use server';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { updateGenresToDisplay } from '@/utils/actions';
import ShowsCarousel from './shows-carousel';

const getShowsByType = async (showType, q) => {
  var shows = [];
  const res = await fetch(`http://localhost:3000/api/trends/${showType}`, {
    method: 'POST',
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

      // Now fetch the genres to display shows by genres
      return fetch(`http://localhost:3000/api/genres/${showType}`, {
        method: 'GET',
      });
    })
    .then((res) => res.json())
    .then(({ genres }) => {
      genres = updateGenresToDisplay(shows, genres);
      genres = genres.filter((g) => g.found === true);

      return {
        shows: shows,
        genres: genres,
      };
    });
  return res;
};

/**
 * The Shows Component
 * @param {showType}
 * @param {q} the Search Query
 * @returns
 */
export default async function Shows({ showType, q }) {
  const { shows, genres } = await getShowsByType(showType, q);

  return (
    <>
      <div className='grid grid-flow-row grid-cols-4 gap-1 mt-4'>
        {genres.map((g) => (
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
        ))}
      </div>
    </>
  );
}
