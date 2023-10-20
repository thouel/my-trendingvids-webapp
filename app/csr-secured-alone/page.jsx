'use client';
// Remember you must use an AuthProvider for
// client components to useSession
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import UserCard from '@c/UserCard';

export default function ClientSideRenderedPageSecuredAlone() {
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/csr-secured-alone');
    },
  });

  return (
    <UserCard
      user={data?.user}
      pageType={'Client Side Rendered Page, Secured Alone'}
    />
  );
}
