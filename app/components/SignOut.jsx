'use client';

import { signOut } from 'next-auth/react';

export default function SignOut() {
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
        <button
          type='submit'
          className='py-1 mt-3 font-semibold text-gray-100 bg-orange-600 rounded shadow-md hover:shadow-lg'
          tabIndex={1}
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
