'use client';

import React, { useEffect, useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import TodoCard from './TodoCard';
import TodoModal from './TodoModal';
import { fetchTodos, deleteTodos } from '@/helpers/fetchTodo';
import { TTodo } from '@/models/todo.model';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function KanbanBoard() {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingTask, setEditingTask] = useState<TTodo | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<TTodo | null>(null);

  const columns = [
    {
      id: 'todo' as const,
      title: 'Todo',
      count: todos.filter((todo) => todo.status === 'todo').length,
      showAddButton: true,
    },
    {
      id: 'inProgress' as const,
      title: 'In Progress',
      count: todos.filter((todo) => todo.status === 'inProgress').length,
      showAddButton: false,
    },
    {
      id: 'review' as const,
      title: 'Review',
      count: todos.filter((todo) => todo.status === 'review').length,
      showAddButton: false,
    },
    {
      id: 'finished' as const,
      title: 'Finished',
      count: todos.filter((todo) => todo.status === 'finished').length,
      showAddButton: false,
    },
  ];

  const handleDragStart = (event: React.DragEvent, todo: TTodo) => {
    event.dataTransfer.setData('text/plain', todo.id);
  };

  const handleDrop = async (event: React.DragEvent, newStatus: string) => {
    event.preventDefault();
    const todoId = event.dataTransfer.getData('text/plain');
    const todo = todos.find((t) => t.id === todoId);

    if (todo && todo.status !== newStatus) {
      try {
        await axiosInstance().patch(`/todos/status/${todoId}`, {
          ...todo,
          status: newStatus,
        });

        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t.id === todoId ? { ...t, status: newStatus as any } : t,
          ),
        );

        const statusText =
          {
            todo: 'Todo',
            inProgress: 'In Progress',
            review: 'Review',
            finished: 'Finished',
          }[newStatus] || newStatus;

        toast.success(`Todo moved to ${statusText}`, {
          duration: 2000,
        });
      } catch (error: any) {
        let errorMessage = 'An error occurred. Please try again.';

        // Extract backend error message
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error('Failed to update todo status', {
          description: errorMessage,
          duration: 3000,
        });
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDeleteTodo = (todo: TTodo) => {
    setTodoToDelete(todo);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTodo = async () => {
    if (!todoToDelete) return;

    try {
      await deleteTodos(todoToDelete.id);
      setTodos((prevTodos) =>
        prevTodos.filter((t) => t.id !== todoToDelete.id),
      );
      toast.success('Todo deleted successfully', {
        duration: 2000,
      });
    } catch (error: any) {
      let errorMessage = 'An error occurred. Please try again.';

      // Extract backend error message
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error('Failed to delete todo', {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setTodoToDelete(null);
    }
  };

  const handleEditTodo = (todo: TTodo) => {
    const task = todos.find((t) => t.id === todo.id);
    if (task) {
      setEditingTask(todo);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };

  const handleAddTodo = () => {
    setEditingTask(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleSaveTodo = () => {
    setIsModalOpen(false);
    fetchTodos(setTodos);
  };

  useEffect(() => {
    fetchTodos(setTodos);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            count={column.count}
            showAddButton={column.showAddButton}
            onAddClick={handleAddTodo}
            onDrop={(e: any) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            {todos
              .filter((todo) => todo.status === column.id)
              .map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onDragStart={(e) => handleDragStart(e, todo)}
                  onDelete={() => handleDeleteTodo(todo)}
                  onEdit={() => handleEditTodo(todo)}
                />
              ))}
          </KanbanColumn>
        ))}
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTodo}
        todo={editingTask}
        mode={modalMode}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTodo}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default KanbanBoard;
