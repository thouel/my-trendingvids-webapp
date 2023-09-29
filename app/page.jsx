'use client';

import { Suspense, useState } from 'react';
import SearchForm from './search-form';
import Shows from './shows';
import Sidebar from './sidebar';

export default function Page() {
  const [shows, setShows] = useState([]);
  const [showType, setShowType] = useState('movies');

  return (
    <>
      <Sidebar
        setShows={setShows}
        setShowType={setShowType}
      />
      <main className=''>
        <SearchForm
          setShows={setShows}
          showType={showType}
        />
        <Suspense fallback={<h2>Loading bitch !</h2>}>
          <Shows
            shows={shows}
            showType={showType}
          />
        </Suspense>
      </main>
    </>
  );
}
