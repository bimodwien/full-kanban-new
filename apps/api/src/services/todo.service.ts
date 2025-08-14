import { Request } from 'express';
import prisma from '@/prisma';
import { TTodo } from '@/models/todo.model';
import { Status, Order } from '@prisma/client';

class TodoService {
  static async getTodos(): Promise<TTodo[]> {
    const todos = await prisma.todo.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    return todos.map(
      (todo): TTodo => ({
        id: todo.id,
        title: todo.title,
        content: todo.content || undefined,
        status: todo.status,
        order: todo.order,
        userId: todo.userId,
        user: {
          id: todo.user.id,
          email: '',
          username: todo.user.username,
          fullName: todo.user.fullName,
        },
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      }),
    );
  }

  static async createTodo(req: Request): Promise<TTodo> {
    const { title, content, order } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        content,
        status: Status.todo,
        order: order || Order.low,
        userId,
      },
    });

    return {
      id: newTodo.id,
      title: newTodo.title,
      content: newTodo.content || undefined,
      status: newTodo.status,
      order: newTodo.order,
      userId: newTodo.userId,
      createdAt: newTodo.createdAt,
      updatedAt: newTodo.updatedAt,
    };
  }

  static async updateTodo(req: Request): Promise<TTodo> {
    const id = req.params.id;
    const { title, content, order } = req.body;
    const userId = req.user?.id;

    const todo = await prisma.todo.findUnique({
      where: {
        id: id,
      },
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    if (todo.userId !== userId) {
      throw new Error('User not authorized to update this todo');
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        order,
      },
    });

    return {
      id: updatedTodo.id,
      title: updatedTodo.title,
      content: updatedTodo.content || undefined,
      status: updatedTodo.status,
      order: updatedTodo.order,
      userId: updatedTodo.userId,
      createdAt: updatedTodo.createdAt,
      updatedAt: updatedTodo.updatedAt,
    };
  }

  static async updateStatusTodo(req: Request): Promise<TTodo> {
    const id = req.params.id;
    const status = req.body.status;
    const userId = req.user?.id;

    const todo = await prisma.todo.findUnique({
      where: {
        id: id,
      },
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    // Then check authorization
    if (todo.userId !== userId) {
      throw new Error('User not authorized to update this todo');
    }

    if (!Object.values(Status).includes(status)) {
      throw new Error('Invalid status');
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: String(id),
      },
      data: {
        status,
      },
    });

    return {
      id: updatedTodo.id,
      title: updatedTodo.title,
      content: updatedTodo.content || undefined,
      status: updatedTodo.status,
      order: updatedTodo.order,
      userId: updatedTodo.userId,
      createdAt: updatedTodo.createdAt,
      updatedAt: updatedTodo.updatedAt,
    };
  }

  static async deleteTodo(req: Request): Promise<void> {
    const id = req.params.id;
    const userId = req.user?.id;

    const todo = await prisma.todo.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    if (todo.userId !== userId) {
      throw new Error('User not authorized to delete this todo');
    }

    await prisma.todo.delete({
      where: {
        id: String(id),
      },
    });
  }
}

export default TodoService;
