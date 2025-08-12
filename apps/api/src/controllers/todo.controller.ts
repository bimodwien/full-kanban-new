'use strict';

import TodoService from '@/services/todo.service';
import { Request, Response, NextFunction } from 'express';

export class TodoController {
  async getTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const todos = await TodoService.getTodos();
      res.send({
        message: 'Todos fetched successfully',
        todos,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const newTodo = await TodoService.createTodo(req);
      res.status(201).json(newTodo);
    } catch (error) {
      next(error);
    }
  }

  async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedTodo = await TodoService.updateTodo(req);
      res.json(updatedTodo);
    } catch (error) {
      next(error);
    }
  }

  async updateStatusTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedTodo = await TodoService.updateStatusTodo(req);
      res.json(updatedTodo);
    } catch (error) {
      next(error);
    }
  }

  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      await TodoService.deleteTodo(req);
      res.status(204).send({
        message: 'Todo deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
