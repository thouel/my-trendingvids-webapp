'use client';
import {
  ListBulletIcon,
  XMarkIcon,
  FilmIcon as FilmIconOutline,
  PlayCircleIcon as PlayCircleIconOutline,
  KeyIcon as KeyIconOutline,
} from '@heroicons/react/24/outline';

import {
  FilmIcon as FilmIconSolid,
  PlayCircleIcon as PlayCircleIconSolid,
  KeyIcon as KeyIconSolid,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Fragment } from 'react';
import { useState } from 'react';

export default function Sidebar() {
  const [isVisible, setIsVisible] = useState(true);
  const handleChange = () => {
    setIsVisible(!isVisible);
  };

  const { data: session } = useSession({ required: false });
  const urlParams = useSearchParams();
  const st = urlParams.get('st');

  return (
    <>
      <input
        type='checkbox'
        id='check'
        checked={isVisible}
        onChange={handleChange}
      />
      <label htmlFor='check'>
        <ListBulletIcon className='h-10 w-10' id='open' />
        <XMarkIcon className='h-8 w-8' id='cancel' />
      </label>

      <nav>
        <header>My Trending Shows</header>
        <ul>
          <li className={st === 'movies' ? 'sidebar-highlight' : ''}>
            <span>
              <FilmIconOutline className='h-6 w-6 inline pb-1 mr-1' />
              <Link href='/shows/movies?st=movies'>Movies</Link>
            </span>
          </li>
          <li className={st === 'tvshows' ? 'sidebar-highlight' : ''}>
            <span>
              <PlayCircleIconOutline className='h-6 w-6 inline pb-1 mr-1' />
              <Link href='/shows/tvshows?st=tvshows'>TV Shows</Link>
            </span>
          </li>
          {session?.user ? (
            <Fragment>
              <li className={st === 'p-shows' ? 'sidebar-highlight' : ''}>
                <span>
                  <FilmIconSolid className='h-6 w-6 inline pb-1 mr-1' />
                  <Link href='/shows/p-shows?st=p-shows'>My Shows</Link>
                </span>
              </li>
              <li>
                <span>
                  <KeyIconSolid className='h-6 w-6 inline pb-1 mr-1' />
                  <Link href='/api/auth/signout?callbackUrl=/'>Sign out</Link>
                </span>
              </li>
            </Fragment>
          ) : (
            <li>
              <span>
                <KeyIconOutline className='h-6 w-6 inline pb-1 mr-1' />
                <Link href='/api/auth/signin'>Sign in</Link>
              </span>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
