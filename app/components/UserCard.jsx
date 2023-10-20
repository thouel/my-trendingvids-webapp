import Image from 'next/image';

export default function UserCard({ user, pageType }) {
  const greetings = user?.name ? (
    <section className='rounded-xl bg-blue-800 text-white text-2xl p-5'>
      Hello {user.name}
    </section>
  ) : null;

  const page = (
    <h1 className='rounded-xl bg-blue-400 text-white text-lg p-5 ml-4'>
      Page &gt;{pageType}
    </h1>
  );

  const avatar = user?.image ? (
    <section className='mt-10'>
      <Image
        src={user.image}
        width={300}
        height={300}
        title={user.image}
        alt={user.image}
      />
    </section>
  ) : null;

  return (
    <div className=''>
      <section className='flex flex-col gap-5 max-w-2xl items-center justify-center'>
        <section className=''>
          {greetings}
          {page}
          {avatar}
        </section>
      </section>
    </div>
  );
}
