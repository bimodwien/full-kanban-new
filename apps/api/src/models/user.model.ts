import { TTodo } from './todo.model';

export type TUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  todos?: TTodo[];
};

export type TDecode = { type: string; user: TUser };
