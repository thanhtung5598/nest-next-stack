'use client';

import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { authService } from '@/data/auth';

export default function OAuthSignInPage() {
  const theme = useTheme();

  const getAuthLink = async () => {
    const authLink = await authService.getAuthLink();
    if (authLink.authorizeLink) {
      const url = new URL(authLink.authorizeLink);
      window.location.href = url.toString();
    }
  };

  const signIn = () => {
    getAuthLink();
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage signIn={signIn} providers={[{ id: 'google', name: 'Google' }]} />
    </AppProvider>
  );
}
