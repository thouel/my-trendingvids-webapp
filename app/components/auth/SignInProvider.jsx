'use client';

import { signIn } from 'next-auth/react';

export default function SignInProvider({ provider }) {
  return (
    <button onClick={() => signIn(provider.id)}>
      Sign in with {provider.name}
    </button>
  );
}
