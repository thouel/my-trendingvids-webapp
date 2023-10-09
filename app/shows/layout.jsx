'use client';

import Sidebar from '@/components/sidebar';
import SearchForm from '@/components/search-form';

export default function ShowsLayout({ children }) {
  // const [shows, setShows] = useState([]);
  // const [showType, setShowType] = useState('all');

  return (
    <>
      <Sidebar />
      <main className=''>
        {/* <SearchForm setShows={setShows} showType={showType} /> */}
        {children}
      </main>
    </>
  );
}
