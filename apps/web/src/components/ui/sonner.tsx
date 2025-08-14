'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme="light"
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        style: {
          background: 'white',
          color: '#374151',
          border: '1px solid #d1d5db',
          fontSize: '14px',
          fontWeight: '500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
