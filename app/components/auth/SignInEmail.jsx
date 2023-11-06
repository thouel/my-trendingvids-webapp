'use client';
import { Fragment } from 'react';

export default function SignInCredentials({ token }) {
  return (
    <Fragment>
      <p>By email</p>
      <form
        method='post'
        action='/api/auth/signin/email'
        className='flex flex-col w-full max-w-sm p-2 text-center border rounded shadow-lg'
      >
        <input type='hidden' name='csrfToken' defaultValue={token} />
        <label htmlFor='email' className='text-sm text-start'>
          Email address
        </label>
        <input
          type='email'
          id='email'
          name='email'
          autoComplete='email'
          required
          className='px-1 text-gray-600 bg-gray-100 border rounded dark:text-gray-600'
          tabIndex={1}
          autoFocus={true}
        />
        <button
          type='submit'
          className='py-1 mt-3 font-semibold text-gray-100 bg-orange-600 rounded shadow-md hover:shadow-lg'
          tabIndex={2}
        >
          Sign in
        </button>
      </form>
    </Fragment>
  );
}
