'use client';

import { useRouter } from 'next/navigation';

export default function LambdaError() {
  const router = useRouter();
  const retry = () => {
    router.refresh();
  };

  return (
    <div className='mx-5'>
      <p>Something strange occured, we are investigating it.</p>
      <p
        onClick={() => retry()}
        className='text-orange-600 cursor-pointer hover:underline'
      >
        Try again ?
      </p>
    </div>
  );
}
