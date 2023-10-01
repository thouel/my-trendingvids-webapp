import {
  ListBulletIcon,
  XMarkIcon,
  FilmIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Sidebar({ setShows, setShowType, showType }) {
  const urlParams = useSearchParams();
  const st = urlParams.get('st');

  const filterByType = (type) => {
    fetch(`http://localhost:3000/api/trends/${type}`, {
      method: 'post',
    })
      .then((res) => res.json())
      .then((data) => {
        setShowType(type);
        setShows(data);
      });
  };

  return (
    <>
      <input type='checkbox' id='check' />
      <label htmlFor='check'>
        <ListBulletIcon className='h-10 w-10' id='open' />
        <XMarkIcon className='h-8 w-8' id='cancel' />
      </label>

      <nav>
        <header>My Trending Shows</header>
        <ul>
          <li className={st === 'movies' ? 'sidebar-highlight' : ''}>
            <span>
              <FilmIcon className='h-6 w-6 inline pb-1 mr-1' />
              <Link href='?st=movies' onClick={(e) => filterByType('movies')}>
                Movies
              </Link>
            </span>
          </li>
          <li className={st === 'tvshows' ? 'sidebar-highlight' : ''}>
            <span>
              <PlayCircleIcon className='h-6 w-6 inline pb-1 mr-1' />
              <Link href='?st=tvshows' onClick={(e) => filterByType('tvshows')}>
                TV Shows
              </Link>
            </span>
          </li>
          <li>
            <span>
              <a href='#'>item 3</a>
            </span>
          </li>
          <li>
            <span>
              <a href='#'>item 4</a>
            </span>
          </li>
          <li>
            <span>
              <a href='#'>item 5</a>
            </span>
          </li>
        </ul>
      </nav>
    </>
  );
}
