import Shows from '@/components/Shows';
import { Suspense } from 'react';
import ShowsLoadingPage from './loading';

export default function Page({ params, searchParams }) {
  return (
    <>
      <Suspense fallback={<ShowsLoadingPage />}>
        <Shows showType={params.showType} q={searchParams?.q} />
      </Suspense>
    </>
  );
}
