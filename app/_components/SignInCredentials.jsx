'use client';

import { Fragment } from 'react';

export default function SignInCredentials({ token }) {
  return (
    <Fragment key={'credentials'}>
      <p>Credentials</p>
      <form
        method='post'
        action='/api/auth/callback/credentials'
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
          className='px-1 bg-gray-100 border rounded'
          tabIndex={1}
          autoFocus={true}
        />
        <div className='flex content-center justify-between mt-3'>
          <label htmlFor='password' className='text-sm text-start'>
            Password
          </label>
          <a
            href='/auth/forgot-password'
            className='text-sm text-orange-600 font-smibold hover:underline'
            tabIndex={4}
          >
            Forgot password?
          </a>
        </div>
        <input
          type='password'
          id='password'
          name='password'
          required
          className='px-1 bg-gray-100 border rounded'
          tabIndex={2}
        />
        <button
          type='submit'
          className='py-1 mt-3 font-semibold text-gray-100 bg-orange-600 rounded shadow-md hover:shadow-lg'
          tabIndex={3}
        >
          Sign in
        </button>
      </form>
    </Fragment>
  );
}
