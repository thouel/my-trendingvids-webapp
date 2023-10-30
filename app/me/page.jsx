import { options } from 'app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import Image from 'next/image';

export default async function MePage() {
  const session = await getServerSession(options);

  return (
    <>
      <h1>Hello {session.user.name}</h1>
      <h2>{session.user.email}</h2>
      <h3>
        <Image
          src={session.user.image}
          alt={`profile pic not found: ${session.user.image}`}
          title='profile picture'
          width={200}
          height={200}
        />
      </h3>
    </>
  );
}
