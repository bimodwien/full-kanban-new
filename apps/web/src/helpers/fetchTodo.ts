import { axiosInstance } from '@/lib/axios';
import { TTodo } from '@/models/todo.model';
import React from 'react';

export const fetchTodos = async (
  setTodos: (value: React.SetStateAction<TTodo[]>) => void,
) => {
  const axios = axiosInstance();
  try {
    const response = await axios.get('/todos');
    const allTodos = response.data.todos;
    setTodos(allTodos);
  } catch (error) {
    console.log(error);
  }
};

export const deleteTodos = async (id: string) => {
  const axios = axiosInstance();
  try {
    await axios.delete(`/todos/${id}`);
  } catch (error) {
    throw error;
  }
};
