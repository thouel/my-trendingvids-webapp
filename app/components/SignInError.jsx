'use client';

import { useSearchParams } from 'next/navigation';
import { useNotificationContext } from 'app/hooks/useNotificationContext';
import { ACTIONS, TYPES } from 'app/providers/NotificationProvider';
import { useEffect, useState } from 'react';

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
  const { notificationDispatch } = useNotificationContext();

  if (!error) return null;

  useEffect(() => {
    const idx = Object.keys(Errors).indexOf(error);
    const errorMessage = Object.values(Errors).at(idx);

    notificationDispatch({
      type: ACTIONS.Add,
      payload: { content: { type: TYPES.Info, message: errorMessage } },
    });
  }, [error]);

  return <></>;
}
