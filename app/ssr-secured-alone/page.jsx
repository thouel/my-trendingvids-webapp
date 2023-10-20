import { options } from 'app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import UserCard from '@c/UserCard';

export default async function ServerSideRenderedPageSecuredAlone() {
  const session = await getServerSession(options);
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/ssr-secured-alone');
  }
  return (
    <>
      {session ? (
        <UserCard
          user={session?.user}
          pageType={'Server Side Rendered Page, Secured Alone'}
        />
      ) : (
        <h1>You shall not pass !</h1>
      )}
    </>
  );
}
