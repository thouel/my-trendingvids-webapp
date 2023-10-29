'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className='flex flex-col items-center justify-center gap-3 mx-5'>
      <form
        method='post'
        onSubmit={handleSubmit}
        className='flex flex-col w-full max-w-sm p-2 text-center border rounded shadow-lg'
      >
        <p>Are you sure you want to sign out?</p>
        <div className='flex flex-row gap-2'>
          <button
            type='button'
            className='w-full py-1 mt-3 font-semibold text-orange-600 bg-gray-100 rounded shadow-md hover:shadow-lg'
            tabIndex={1}
            onClick={() => {
              router.back();
            }}
          >
            Back
          </button>
          <button
            type='submit'
            className='w-full py-1 mt-3 font-semibold text-gray-100 bg-orange-600 rounded shadow-md hover:shadow-lg'
            tabIndex={2}
          >
            Sign out
          </button>
        </div>
      </form>
    </div>
  );
}
