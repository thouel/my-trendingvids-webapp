import { options } from 'app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export default async function MePage() {
  const session = await getServerSession(options);

  return (
    <>
      <h1>Hello {session.user.name}</h1>
      <h2>{session.user.email}</h2>
      <h3>
        <img
          src={session.user.image}
          alt={`profile pic not found: ${session.user.image}`}
          title='profile picture'
        />
      </h3>
    </>
  );
}
