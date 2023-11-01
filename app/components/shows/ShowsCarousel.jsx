'use client';
import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { getLabel } from 'app/utils/helper';

export default function ShowsCarousel({ genreLabel, shows, showType }) {
  return (
    <>
      {shows === undefined || shows.length <= 0 ? (
        <div className='col-span-4'>Nothing yet !</div>
      ) : (
        <Splide
          aria-label={genreLabel}
          className='min-w-0 col-span-4'
          options={{
            type: 'slide',
            arrows: shows.length > 2 ? true : false,
            perPage: 2,
            rewind: true,
            heightRatio: 0.35,
            gap: '.25rem',
            pagination: false,
            /* for devices with width>640px, custom props */
            mediaQuery: 'min',
            breakpoints: {
              640: {
                perPage: 4,
                arrows: shows.length > 4 ? true : false,
                heightRatio: 0.2,
              },
            },
          }}
        >
          {shows.map((s) => (
            <Fragment key={s.id}>
              <SplideSlide>
                <div className='p-1 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100'>
                  <Link
                    href={`/show/${showType}/${s.externalId ?? s.id}`}
                    scroll={false}
                  >
                    <Image
                      src={
                        'https://image.tmdb.org/t/p/w300' +
                        (s.backdrop_path ?? s.backdropPath)
                      }
                      alt={getLabel(s)}
                      title={getLabel(s)}
                      width={300}
                      height={300}
                    />
                    <div className='mt-1 text-xs text-gray-900 truncate dark:text-gray-100 sm:text-sm'>
                      {getLabel(s)}
                    </div>
                  </Link>
                </div>
              </SplideSlide>
            </Fragment>
          ))}
        </Splide>
      )}
    </>
  );
}
