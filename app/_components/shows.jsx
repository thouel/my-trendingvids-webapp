import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { updateGenresToDisplay } from '@/utils/actions';
import ShowsCarousel from './shows-carousel';

/**
 * The Shows Component
 * @param {shows}
 * @param {showType}
 * @returns
 */
export default function Shows({ shows, showType }) {
  const [genres, setGenres] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGenres() {
      console.log('fetch genres');

      setIsLoading(true);

      try {
        setGenres(
          await fetch(`http://localhost:3000/api/genres/${showType}`, {
            method: 'GET',
          })
            .then((res) => res.json())
            .then((data) => {
              const res = updateGenresToDisplay(shows, data.genres);
              setIsLoading(false);
              return res;
            })
        );
      } catch (e) {
        console.error(e);
      }
    }
    fetchGenres();
  }, [shows, showType]);

  const getLabel = (show) => {
    return show.title ? show.title : show.name;
  };

  return (
    <>
      <div className='grid grid-flow-row grid-cols-4 gap-1 mt-4'>
        {(shows === undefined || shows.length == 0) && (
          <div className='text-xl col-span-4'>
            Nothing yet ! Perhaps soon ...
          </div>
        )}
        {!isLoading &&
          shows.length > 0 &&
          genres
            .filter((g) => g.found === true)
            .map((g) => (
              <Fragment key={g.id}>
                <span className='col-span-4 row-auto relative text-lg font-bold'>
                  <ChevronRightIcon className='w-6 h-6 inline pb-1 mr-1' />
                  {g.name}
                </span>
                <ShowsCarousel
                  getLabel={getLabel}
                  genreLabel={g.name}
                  shows={shows.filter((s) => s.genre_ids.indexOf(g.id) > -1)}
                />
              </Fragment>
            ))}
      </div>
    </>
  );
}
