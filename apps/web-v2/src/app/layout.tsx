import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/main.css';

const inter = Inter({ subsets: ['latin-ext'], display: 'swap', variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'bitA Vietnam',
  description: 'Come to bitA Vietnam',
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
