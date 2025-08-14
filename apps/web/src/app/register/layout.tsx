import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kanban Bimo - Register',
  description: 'Create a new account',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
