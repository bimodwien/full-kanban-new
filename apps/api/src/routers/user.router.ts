import { UserController } from '@/controllers/user.controller';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/register', this.userController.register);
    this.router.post('/login', this.userController.login);
    this.router.get('/getUsers', this.userController.findUsers);
  }

  public getRouter(): Router {
    return this.router;
  }
}
