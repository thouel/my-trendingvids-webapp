'use client';

import { useSearchParams } from 'next/navigation';
import { Toast, Types } from './Toast';

const Errors = {
  Configuration: 'Configuration problem',
  AccessDenied: 'Access denied',
  Verification: 'Magic link expired or already used',
  OAuthSignin: 'OAuth error',
  OAuthCallback: 'OAuth error',
  OAuthCreateAccount: 'OAuth error',
  EmailCreateAccount: 'Failed to send email with magic link',
  Callback: 'OAuth error',
  OAuthAccountNotLinked: 'Account already linked with another OAuth provider',
  EmailSignin: 'Failed to send email with magic link',
  CredentialsSignin: 'Credentials login failed',
  SessionRequired: 'Login first please',
  Default: 'Something bad happened',
};

export default function SignInError({}) {
  const error = useSearchParams().get('error');

  if (!error) return null;

  const idx = Object.keys(Errors).indexOf(error);
  const errorMessage = Object.values(Errors).at(idx);
  return (
    <>
      <Toast type={Types.Warning} message={errorMessage} />
    </>
  );
}
