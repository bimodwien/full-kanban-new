'use client';

import React from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  key?: string;
  title: string;
  count: number;
  showAddButton: boolean;
  onAddClick: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  children?: React.ReactNode;
}
export const KanbanColumn = ({
  title,
  count,
  showAddButton,
  onAddClick,
  onDrop,
  onDragOver,
  children,
}: KanbanColumnProps) => {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between h-9">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </h2>
        <div className="w-9 flex justify-center">
          {showAddButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddClick}
              className="h-9 w-9 sm:h-8 sm:w-8 p-0 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>
      <div
        className="space-y-4 min-h-[400px] p-2 rounded-lg bg-gray-50/50"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {children}
      </div>
    </div>
  );
};
