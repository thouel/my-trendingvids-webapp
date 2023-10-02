import { Splide, SplideSlide } from '@splidejs/react-splide';
import Image from 'next/image';
import '@splidejs/react-splide/css';
import ShowCard from './show-card';
import { Fragment, useState } from 'react';
import { getLabel } from '@/utils/shows';

export default function ShowsCarousel({ genreLabel, shows }) {
  const [modal, setModal] = useState();

  const openModal = (show) => {
    setModal(show.id);
  };

  const closeModal = () => {
    setModal(-1);
  };

  return (
    <Splide
      aria-label={genreLabel}
      className='col-span-4'
      options={{
        type: 'slide',
        perPage: 4,
        height: '140px',
        rewind: true,
        gap: '.25rem',
        pagination: false,
      }}
    >
      {shows.map((s) => (
        <Fragment key={s.id}>
          <SplideSlide>
            <Image
              src={'https://image.tmdb.org/t/p/w300' + s.backdrop_path}
              alt={getLabel(s)}
              title={getLabel(s)}
              width={300}
              height={300}
            />
            <div
              className='text-white bg-gray-900 text-sm absolute inset-0 opacity-0 hover:opacity-100 duration-300 flex justify-center items-center z-10 p-3'
              onClick={() => openModal(s)}
            >
              <span>{getLabel(s)}</span>
            </div>
          </SplideSlide>
          {modal === s.id ? (
            <ShowCard show={s} onCloseCallback={closeModal} />
          ) : (
            ''
          )}
        </Fragment>
      ))}
    </Splide>
  );
}
