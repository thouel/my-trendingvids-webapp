'use client';

import Sidebar from '@/components/sidebar';
import SearchForm from '@/components/search-form';

export default function ShowsLayout({ children }) {
  return (
    <>
      <Sidebar />
      <main className=''>
        <SearchForm />
        {children}
      </main>
    </>
  );
}
