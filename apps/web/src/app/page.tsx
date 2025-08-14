'use client';

import React from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="mx-auto max-w-7xl">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
}
