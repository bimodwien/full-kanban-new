import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from '@/components/providers/store.provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Kanban Bimo',
  description: 'A Kanban board application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
