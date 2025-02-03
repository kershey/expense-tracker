import type { Metadata } from 'next';
import './globals.css';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Expense Tracker - Jensen',
  description:
    'A simple and intuitive expense tracking application to help you manage your finances, track spending patterns, and reach your financial goals.',
};

import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
