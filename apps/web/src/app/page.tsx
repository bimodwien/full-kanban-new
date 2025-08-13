'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout } from '@/lib/redux/slices/user.slice';
import { Button } from '@/components/ui/button';

export default function Home() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Kanban Board!</h1>

      {user.id ? (
        <div className="space-y-4">
          <p className="text-lg">
            Hello,{' '}
            <span className="font-semibold">
              {user.fullName || user.username}!
            </span>
          </p>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      ) : (
        <p>Please login to continue...</p>
      )}
    </div>
  );
}
