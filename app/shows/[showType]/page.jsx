import Shows from '@/components/shows';
import { Suspense } from 'react';
import LoadingPage from './loading';

export default function Page({ params }) {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <Shows showType={params.showType} />
      </Suspense>
    </>
  );
}
