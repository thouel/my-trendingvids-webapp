'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchShowsByType } from 'app/utils/actions';
import LambdaError from '../LambdaError';
import Shows from './Shows';
import { useSession } from 'next-auth/react';

export default function HydratedShows({ showType, q }) {
  const { data: session } = useSession();

  console.log(`>> fetching shows-${showType}`);
  const { isPending, isError, data, error } = useQuery({
    queryKey: [`shows-${showType}`, { showType, q, session }],
    queryFn: fetchShowsByType,
  });

  if (isPending) {
    return null;
  }

  if (isError) {
    console.error(error);
    return <LambdaError />;
  }

  const { shows, genres, isPinned } = data;

  return (
    <>
      <Shows
        shows={shows}
        genres={genres}
        isPinned={isPinned}
        showType={showType}
      />
    </>
  );
}
