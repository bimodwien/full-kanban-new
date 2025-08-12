import { TodoController } from '@/controllers/todo.controller';
import { Router } from 'express';
import { validateAccessToken } from '@/middelwares/auth.middleware';

export class TodoRouter {
  private router: Router;
  private todoController: TodoController;

  constructor() {
    this.router = Router();
    this.todoController = new TodoController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.todoController.getTodos);
    this.router.post('/', validateAccessToken, this.todoController.createTodo);
    this.router.put(
      '/:id',
      validateAccessToken,
      this.todoController.updateTodo,
    );
    this.router.patch(
      '/status/:id',
      validateAccessToken,
      this.todoController.updateStatusTodo,
    );
    this.router.delete(
      '/:id',
      validateAccessToken,
      this.todoController.deleteTodo,
    );
  }
  public getRouter(): Router {
    return this.router;
  }
}
