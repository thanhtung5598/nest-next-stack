import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppLayout } from '@/components/Layout/AppLayout';

import '@/styles/main.css';
import { headers } from 'next/headers';
import { ROUTE } from '@/libs/enum';

const inter = Inter({ subsets: ['latin-ext'], display: 'swap', variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'bitA Vietnam',
  description: 'Come to bitA Vietnam',
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  const loginIn = !!headers().get('x-logged')?.length;
  const pathname = headers().get('x-pathname') || ROUTE.DASHBOARD;

  return (
    <html lang="en">
      <body className={inter.variable}>
        {!loginIn ? children : <AppLayout pathname={pathname}>{children}</AppLayout>}
      </body>
    </html>
  );
}
