import { fetchShowsByType } from 'app/utils/actions';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import { options } from 'app/api/auth/[...nextauth]/options';
import HydratedShows from 'app/components/shows/HydratedShows';
import getQueryClient from 'app/hooks/getQueryClient';

export default async function ShowsPage({ params, searchParams }) {
  const session = await getServerSession(options);
  const { showType } = params;
  const { q } = searchParams;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [`shows-${showType}`, { showType, q, session }],
    queryFn: fetchShowsByType,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HydratedShows showType={showType} q={q} />
    </HydrationBoundary>
  );
}
