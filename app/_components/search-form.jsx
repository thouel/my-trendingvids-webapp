'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryString, setQueryString] = useState(searchParams.get('q'));

  const createQueryString = () => {
    const params = new URLSearchParams(searchParams);
    params.set('q', queryString);
    return params.toString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(pathname.toString() + '?' + createQueryString());
  };

  return (
    <div className='flex justify-end mt-4'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          id='show'
          name='show'
          placeholder='Search a show'
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
        />

        <button type='submit' id='searchBtn'>
          <MagnifyingGlassIcon className='w-8 h-8 inline align-text-bottom ml-1 mr-1' />
        </button>
      </form>
    </div>
  );
}
