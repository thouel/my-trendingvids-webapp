'use client';
import { PlayCircleIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useState, useEffect } from 'react';
import { isDarkTheme } from '@u/helper';
import ThemeButton from './ThemeButton';

export default function Navbar() {
  const { data: session } = useSession({ required: false });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const st = searchParams.get('st') ?? '';
  const [queryString, setQueryString] = useState(searchParams.get('q') ?? '');
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  useEffect(() => {
    setMenuIsOpen(false);
  }, [pathname, searchParams]);

  const createQueryString = () => {
    const params = new URLSearchParams(searchParams);
    params.set('q', queryString);
    return params.toString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(pathname.toString() + '?' + createQueryString());
    setMenuIsOpen(false);
  };

  const style = {
    link: {
      selected:
        'block py-2 pl-3 pr-4 text-gray-100 bg-orange-700 rounded md:bg-transparent md:text-orange-600 md:p-0 md:dark:text-orange-500',
      notSelected:
        'block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 md:p-0 md:dark:hover:text-orange-500 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-100 md:dark:hover:bg-transparent dark:border-gray-700',
    },
  };

  useEffect(() => {
    const setupTheme = () => {
      if (isDarkTheme()) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
      }
    };
    setupTheme();
  }, []);

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  return (
    <nav className='fixed top-0 left-0 z-10 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-600'>
      <div className='flex flex-wrap items-center justify-between max-w-screen-xl p-2 mx-auto'>
        <Link href={'/'} className='flex items-center'>
          <PlayCircleIcon className='w-8 h-8 mr-2 text-orange-600' />
          <span className='self-center text-xl font-semibold text-black whitespace-nowrap dark:text-gray-100'>
            My Trending Videos
          </span>
        </Link>
        <div className='flex md:order-2'>
          {/* Theme button (Dark/Light) */}
          <div className='inline-flex items-center justify-center w-10 h-10 p-2 mr-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'>
            <ThemeButton />
          </div>

          {/* Search bar for large devices */}
          <div className='relative hidden md:block'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
              <span className='sr-only'>Search icon</span>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                id='search-navbar-sm'
                className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100 dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Search...'
                value={queryString}
                onChange={(e) => setQueryString(e.target.value)}
              />
            </form>
          </div>

          {/* Menu icon for small devices */}
          <button
            data-collapse-toggle='navbar-search'
            type='button'
            className='inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-search'
            aria-expanded='false'
            onClick={toggleMenu}
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 1h15M1 7h15M1 13h15'
              />
            </svg>
          </button>
        </div>
        <div
          className={
            'items-center justify-between w-full md:flex md:w-auto md:order-1' +
            (menuIsOpen ? '' : ' hidden')
          }
          id='navbar-search'
        >
          <div className='relative mt-3 md:hidden'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                id='search-navbar'
                className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100 dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Search...'
                value={queryString}
                onChange={(e) => setQueryString(e.target.value)}
              />
            </form>
          </div>
          <ul className='flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg md:p-0 bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
            <li>
              <Link
                href='/shows/movies?st=movies'
                className={
                  st === 'movies' ? style.link.selected : style.link.notSelected
                }
                aria-current='page'
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                href='/shows/tvshows?st=tvshows'
                className={
                  st === 'tvshows'
                    ? style.link.selected
                    : style.link.notSelected
                }
              >
                TV Shows
              </Link>
            </li>
            {session?.user ? (
              <Fragment>
                <li>
                  <Link
                    href='/shows/p-shows?st=p-shows'
                    className={
                      st === 'p-shows'
                        ? style.link.selected
                        : style.link.notSelected
                    }
                  >
                    My Shows
                  </Link>
                </li>
                <li>
                  <Link
                    href='/api/auth/signout?callbackUrl=/'
                    className={style.link.notSelected}
                  >
                    Sign out
                  </Link>
                </li>
              </Fragment>
            ) : (
              <li>
                <Link
                  href='/auth/signin?st=signin'
                  className={
                    st === 'signin'
                      ? style.link.selected
                      : style.link.notSelected
                  }
                >
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
