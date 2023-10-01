'use client';

import { Suspense, useState } from 'react';
import SearchForm from '@/components/search-form';
import Shows from '@/components/shows';
import Sidebar from '@/components/sidebar';

export default function Page() {
  const [shows, setShows] = useState([]);
  const [showType, setShowType] = useState('movies');

  return (
    <>
      <Sidebar
        setShows={setShows}
        setShowType={setShowType}
        showType={showType}
      />
      <main className=''>
        <SearchForm setShows={setShows} showType={showType} />
        <Shows shows={shows} showType={showType} />
      </main>
    </>
  );
}
