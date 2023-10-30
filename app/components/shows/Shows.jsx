import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import ShowsCarousel from './ShowsCarousel';

/**
 * The Shows Component
 * @param {shows}
 * @param {genres}
 * @param {isPinned}
 * @param {showType}
 * @returns
 */
export default function Shows({ shows, genres, isPinned, showType }) {
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
