'use client';

import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Trash2, Edit3 } from 'lucide-react';
import type { TTodo } from '@/models/todo.model';

interface TodoCardProps {
  todo: TTodo;
  onDragStart: (e: React.DragEvent) => void;
  onDelete: () => void;
  onEdit: () => void;
}

const TodoCard = ({ todo, onDragStart, onDelete, onEdit }: TodoCardProps) => {
  const getPriorityColor = (order: TTodo['order']) => {
    switch (order) {
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getInitialUser = (fullName: string) => {
    return fullName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const toTitleCase = (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toCapitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'No date';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return 'Invalid date';

    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      className="p-4 cursor-move hover:shadow-md transition-shadow border border-gray-200 touch-manipulation"
      draggable
      onDragStart={onDragStart}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={`text-xs font-medium capitalize ${getPriorityColor(todo.order)}`}
          >
            {todo.order}
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h3 className="text-base font-medium text-gray-900 leading-relaxed">
          {toTitleCase(todo.title)}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {toCapitalizeFirstLetter(todo.content ? todo.content : '')}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            {formatDate(todo.createdAt)}
          </span>

          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarFallback className="text-sm bg-gray-100 text-gray-700">
              {getInitialUser(todo.user?.fullName || 'User')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Card>
  );
};

export default TodoCard;
