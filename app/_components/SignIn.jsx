import { getServerSession, signIn } from 'next-auth';
import { getProviders, getCsrfToken } from 'next-auth/react';
import { options } from 'app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import SignInProvider from './SignInProvider';
import SignInCredentials from './SignInCredentials';
import { cookies } from 'next/headers';

export default async function SignIn() {
  const session = await getServerSession(options);

  // If the user is already logged in, redirect.
  // Make sure not to redirect to the same page
  // to avoid infinite loop!
  if (session) {
    redirect('/');
  }

  const providers = await getProviders();
  const csrfToken = await getCsrfToken({
    req: { headers: { cookie: cookies().toString() } },
  });

  return (
    <div className='flex flex-col items-center justify-center gap-3 mx-5'>
      {/* Credentials (email/password) */}
      {Object.values(providers)
        .filter((p) => p.type === 'credentials')
        .map((p) => (
          <SignInCredentials token={csrfToken} />
        ))}
      {/* OAuth Providers */}
      <div
        className={`relative w-full sm:w-2/5 before:absolute before:block before:content-[''] before:left-0 before:top-1/2 before:h-1 before:bg-orange-400 dark:before:bg-gray-100 dark:after:bg-gray-100 before:rounded before:w-2/5  after:absolute after:block after:content-[''] after:right-0 after:top-1/2 after:h-1 after:bg-orange-400 after:rounded after:w-2/5 `}
      >
        <div className='text-center'>Or</div>
      </div>
      {Object.values(providers)
        .filter((p) => p.type === 'oauth')
        .map((p, index) => (
          <div
            key={p.name}
            className='w-full max-w-sm py-2 font-semibold text-center border rounded shadow-md hover:shadow-lg hover:bg-orange-600 hover:text-gray-100'
            tabIndex={index + 1 + 4}
          >
            <SignInProvider provider={p} />
          </div>
        ))}
    </div>
  );
}
