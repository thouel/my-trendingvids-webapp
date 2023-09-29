'use client';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

const fetchGenres = async (pShowType) => {
  if (pShowType === undefined || pShowType === 'all') return;
  console.log('fetch genres', pShowType, process.env.LOCAL_URL);

  const res = await fetch(`${process.env.LOCAL_URL}/api/genres/${pShowType}`, {
    method: 'GET',
  });
  const data = await res.json();
  console.log('in fetchGenres ! data.genres', data.genres);

  return data.genres;
};

export default function Shows({ shows, showType }) {
  const getLabel = (show) => {
    return show.title ? show.title : show.name;
  };

  function getGenres() {
    return showType === 'movies' ? moviesGenre : tvShowsGenre;
  }

  const updateGenresToDisplay = (genres) => {
    if (genres === undefined || genres.length == 0) return;
    if (shows === undefined || shows.length == 0) return;

    shows.forEach((s) => {
      s.genre_ids.forEach((gi) => {
        genres.filter((g) => gi === g.id)[0].found = true;
      });
    });
  };

  // const {
  //   isMoviesGenreLoading,
  //   isMoviesGenreError,
  //   moviesGenre,
  //   moviesGenreError,
  // } = useQuery({
  //   queryKey: ['moviesGenre'],
  //   queryFn: () => fetchGenres('movies'),
  //   suspense: true,
  //   staleTime: 5 * 1000,
  // });
  // const {
  //   isTVShowsGenreLoading,
  //   isTVShowsGenreError,
  //   tvShowsGenre,
  //   tvShowsGenreError,
  // } = useQuery({
  //   queryKey: ['tvShowsGenre'],
  //   queryFn: () => fetchGenres('tvshows'),
  //   suspense: true,
  //   staleTime: 5 * 1000,
  // });

  updateGenresToDisplay(moviesGenre);
  updateGenresToDisplay(tvShowsGenre);

  if (isMoviesGenreLoading || isTVShowsGenreLoading) {
    return <span>Loading ...</span>;
  }
  if (isMoviesGenreError || isTVShowsGenreError) {
    return (
      <>
        <h2>Error !</h2>
        <h3>Movies: {moviesGenreError}</h3>
        <h3>TVShows: {tvShowsGenreError}</h3>
      </>
    );
  }
  console.log(`getGenres(${showType})`, getGenres(), moviesGenre, tvShowsGenre);

  return (
    <>
      <div className='grid grid-flow-row grid-cols-4 gap-1 mt-4'>
        {(shows === undefined || shows.length == 0) && (
          <div className='text-xl col-span-4'>
            Nothing yet ! Perhaps soon ...
          </div>
        )}
        {getGenres()
          .filter((g) => g.found === true)
          .map((g) => (
            <>
              <span className='col-span-4 row-auto relative text-lg font-bold'>
                <ChevronRightIcon className='w-6 h-6 inline pb-1 mr-1' />
                {g.name}
              </span>
              {shows
                .filter((s) => s.genre_ids.indexOf(g.id) > -1)
                .map((s) => (
                  <div
                    className='row-auto relative'
                    key={s.id}
                  >
                    <Image
                      src={'https://image.tmdb.org/t/p/w500' + s.backdrop_path}
                      alt={getLabel(s)}
                      title={getLabel(s)}
                      width={300}
                      height={300}
                      className=''
                    />
                    <p className='text-white bg-gray-900 text-sm absolute inset-0 opacity-0 hover:opacity-100 duration-300 flex justify-center items-center z-10 p-3'>
                      {getLabel(s)}
                    </p>
                  </div>
                ))}
            </>
          ))}
      </div>
    </>
  );
}
