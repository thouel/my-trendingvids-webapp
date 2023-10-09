'use client';

import Sidebar from '@/components/Sidebar';
import SearchForm from '@/components/SearchForm';

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
