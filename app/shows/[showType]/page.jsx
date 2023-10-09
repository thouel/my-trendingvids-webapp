import Shows from '@/components/Shows';
import { Suspense } from 'react';
import LoadingPage from './loading';

export default function Page({ params, searchParams }) {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <Shows showType={params.showType} q={searchParams?.q} />
      </Suspense>
    </>
  );
}
