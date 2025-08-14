'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  TTodo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from '@/models/todo.model';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  todo?: TTodo | null;
  mode: 'add' | 'edit';
}

const TodoModal = ({ isOpen, onClose, onSave, todo, mode }: TodoModalProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const initialValues = {
    title: mode === 'edit' && todo ? todo.title : '',
    content: mode === 'edit' && todo ? todo.content || '' : '',
    order: (mode === 'edit' && todo ? todo.order : 'low') as
      | 'low'
      | 'medium'
      | 'high',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be less than 100 characters'),
    content: Yup.string().max(500, 'Content must be less than 500 characters'),
    order: Yup.string()
      .oneOf(['low', 'medium', 'high'], 'Invalid priority')
      .required('Priority is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const axios = axiosInstance();

        if (mode === 'add') {
          const createData: CreateTodoRequest = {
            title: values.title,
            content: values.content || undefined,
            order: values.order,
          };

          await axios.post('/todos', createData);

          toast.success('Todo created successfully!', {
            duration: 2000,
          });
        } else if (mode === 'edit' && todo) {
          const updateData: UpdateTodoRequest = {
            title: values.title,
            content: values.content || undefined,
            order: values.order,
          };

          await axios.put(`/todos/${todo.id}`, updateData);

          toast.success('Todo updated successfully!', {
            duration: 2000,
          });
        }

        onSave();
        onClose();
        formik.resetForm();
      } catch (error: any) {
        console.error('Error saving todo:', error);

        let errorMessage = 'Please try again';

        // Extract backend error message
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(
          mode === 'add' ? 'Failed to create todo' : 'Failed to update todo',
          {
            description: errorMessage,
            duration: 3000,
          },
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Enter to submit form, but not when focus is on textarea
    if (e.key === 'Enter' && !e.shiftKey) {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (formik.isValid && !isLoading) {
          formik.handleSubmit();
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Todo' : 'Edit Todo'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Create a new todo item. Fill in the details below.'
              : 'Update the todo item details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter todo title"
                {...formik.getFieldProps('title')}
                className={
                  formik.touched.title && formik.errors.title
                    ? 'border-red-500'
                    : ''
                }
              />
              {formik.touched.title && formik.errors.title && (
                <span className="text-sm text-red-600">
                  {formik.errors.title}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Description</Label>
              <Textarea
                id="content"
                placeholder="Enter todo description (optional)"
                rows={3}
                {...formik.getFieldProps('content')}
                className={
                  formik.touched.content && formik.errors.content
                    ? 'border-red-500'
                    : ''
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.stopPropagation(); // Prevent the dialog's keydown handler
                  }
                }}
              />
              {formik.touched.content && formik.errors.content && (
                <span className="text-sm text-red-600">
                  {formik.errors.content}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="order">Priority *</Label>
              <Select
                value={formik.values.order}
                onValueChange={(value) => formik.setFieldValue('order', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.order && formik.errors.order && (
                <span className="text-sm text-red-600">
                  {formik.errors.order}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formik.isValid}>
              {isLoading
                ? mode === 'add'
                  ? 'Creating...'
                  : 'Updating...'
                : mode === 'add'
                  ? 'Create Todo'
                  : 'Update Todo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoModal;
