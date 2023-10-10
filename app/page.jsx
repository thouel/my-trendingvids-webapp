'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const url = '/shows/movies?st=movies';

  useEffect(() => {
    router.push(url);
  }, []);
  return <></>;
}
