import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='ml-1 text-sm'>
      <span className=''>Obit, inc.</span>
      <ul>
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
          <Link href={'/api/auth/signout'}>Sign Out</Link>
        </li>
      </ul>
    </footer>
  );
}
