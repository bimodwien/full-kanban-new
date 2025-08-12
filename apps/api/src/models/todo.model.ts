import { Status, Order } from '@prisma/client';
import { TUser } from './user.model';

export type TTodo = {
  id: string;
  title: string;
  content?: string;
  status: Status;
  order: Order;
  userId?: string;
  user?: TUser;
  createdAt?: Date;
  updatedAt?: Date;
};
