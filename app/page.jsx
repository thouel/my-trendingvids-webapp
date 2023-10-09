'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  router.replace('/shows/movies?st=movies');
  return <></>;
}
