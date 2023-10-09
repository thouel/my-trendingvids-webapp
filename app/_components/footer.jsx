'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Footer() {
  const { data: session } = useSession({
    required: false,
  });

  const logSession = () => {
    console.log(session);
  };

  return (
    <footer className='ml-1 text-sm'>
      <span className=''>Obit, inc.</span>
      <ul>
        <li>
          <Link href={'/shows/movies'}>Go to movies</Link>
        </li>
        <li>
          <span onClick={() => logSession()}>Log Session</span>
        </li>
        <li>
          <Link href={'/login'}>Login Modal</Link>
        </li>
        <li>
          <Link href={'/'}>My Trending Videos</Link>
        </li>
        <li>
          <Link href={'/ssr-secured-by-middleware'}>
            SSR Secured By Middleware
          </Link>
        </li>
        <li>
          <Link href={'/ssr-secured-alone'}>SSR Secured Alone</Link>
        </li>
        <li>
          <Link href={'/csr-secured-alone'}>CSR Secured Alone</Link>
        </li>
        <li>
          {session ? (
            <Link href={'/api/auth/signout'}>Sign Out</Link>
          ) : (
            <Link href={'/api/auth/signin?callbackUrl=/'}>Sign in</Link>
          )}
        </li>
      </ul>
    </footer>
  );
}
