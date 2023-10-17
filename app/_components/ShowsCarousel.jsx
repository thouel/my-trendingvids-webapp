'use client';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Image from 'next/image';
import '@splidejs/react-splide/css';
import ShowCard from './ShowCard';
import { Fragment, useState } from 'react';
import { getLabel } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ShowsCarousel({ genreLabel, shows, showType }) {
  const router = useRouter();
  const [modal, setModal] = useState();

  const openModal = (show) => {
    setModal(show.id);
  };

  const closeModal = () => {
    setModal(-1);
  };

  return (
    <>
      {shows === undefined || shows.length <= 0 ? (
        'Nothing yet !'
      ) : (
        <Splide
          aria-label={genreLabel}
          className='col-span-4'
          options={{
            type: 'slide',
            perPage: 4,
            height: '160px',
            rewind: true,
            gap: '.25rem',
            pagination: false,
          }}
        >
          {shows.map((s) => (
            <Fragment key={s.id}>
              <SplideSlide>
                <div className='rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 p-1'>
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
                    <span className='text-gray-900 dark:text-gray-100 text-xs'>
                      {getLabel(s, true)}
                    </span>
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
