'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout } from '@/lib/redux/slices/user.slice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());

    toast.success('Logged out successfully', {
      duration: 2000,
    });

    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
            Kanban Bimo
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
            Manage your tasks efficiently
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-medium">
                  {user.fullName ? getInitials(user.fullName) : ''}
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 hover:cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
