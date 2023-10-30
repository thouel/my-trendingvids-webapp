import { fetchShowsByType } from 'app/_utils/actions';
import { options } from 'app/api/auth/[...nextauth]/options';
import LambdaError from 'app/components/LambdaError';
import Shows from 'app/components/shows/Shows';
import { getServerSession } from 'next-auth';

export default async function Page({ params, searchParams }) {
  const session = await getServerSession(options);
  const { shows, genres, isPinned, error } = await fetchShowsByType(
    session,
    params.showType,
    searchParams?.q,
  );

  if (error) {
    return <LambdaError />;
  }

  return (
    <>
      <Shows
        shows={shows}
        genres={genres}
        isPinned={isPinned}
        showType={params.showType}
      />
    </>
  );
}
