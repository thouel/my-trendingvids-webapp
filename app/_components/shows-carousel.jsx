import { Splide, SplideSlide } from '@splidejs/react-splide';
import Image from 'next/image';
import '@splidejs/react-splide/css';

export default function ShowsCarousel({ getLabel, genreLabel, shows }) {
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
        <SplideSlide key={s.id}>
          <Image
            src={'https://image.tmdb.org/t/p/w300' + s.backdrop_path}
            alt={getLabel(s)}
            title={getLabel(s)}
            width={300}
            height={300}
          />
          <div className='text-white bg-gray-900 text-sm absolute inset-0 opacity-0 hover:opacity-100 duration-300 flex justify-center items-center z-10 p-3'>
            <span>{getLabel(s)}</span>
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
}
