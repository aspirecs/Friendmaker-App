import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FriendMaker - AI-Powered Friendship Matching',
  description: 'Find genuine friendships through AI-powered matching',
  keywords: 'friendship, social, discord, matching, AI',
  authors: [{ name: 'FriendMaker Team' }],
  openGraph: {
    title: 'FriendMaker',
    description: 'AI-powered friendship matching platform',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}