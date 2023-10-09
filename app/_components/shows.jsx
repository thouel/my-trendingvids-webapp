'use server';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { updateGenresToDisplay } from '@/utils/actions';
import ShowsCarousel from './shows-carousel';

const getShowsByType = async (showType) => {
  var shows = [];
  const res = await fetch(`http://localhost:3000/api/trends/${showType}`, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then(async (pShows) => {
      shows = pShows;
      return fetch(`http://localhost:3000/api/genres/${showType}`, {
        method: 'GET',
      });
    })
    .then((res) => res.json())
    .then(({ genres }) => {
      genres = updateGenresToDisplay(shows, genres);

      return {
        isLoading: false,
        shows: shows,
        genres: genres,
      };
    });
  return res;
};

/**
 * The Shows Component
 * @param {showType}
 * @returns
 */
export default async function Shows({ showType }) {
  const { shows, genres, isLoading } = await getShowsByType(showType);

  return (
    <>
      <div className='grid grid-flow-row grid-cols-4 gap-1 mt-4'>
        {isLoading ? (
          <div className='text-xl col-span-4'>
            Nothing yet ! Perhaps soon ...
          </div>
        ) : (
          genres
            .filter((g) => g.found === true)
            .map((g) => (
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
