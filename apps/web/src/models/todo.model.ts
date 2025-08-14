import { TUser } from './user.model';

// Status enum sesuai dengan backend
export type Status = 'todo' | 'inProgress' | 'review' | 'finished';

// Order enum sesuai dengan backend
export type Order = 'low' | 'medium' | 'high';

export interface TTodo {
  id: string;
  title: string;
  content?: string; // Optional sesuai backend (nullable)
  status: Status;
  order: Order;
  userId: string; // Required untuk ownership
  user?: TUser; // Optional untuk populated data
  createdAt?: Date; // Optional untuk response
  updatedAt?: Date; // Optional untuk response
}

// Type untuk create todo (tidak butuh id, userId auto dari auth)
export interface CreateTodoRequest {
  title: string;
  content?: string;
  order?: Order; // Optional, default 'low' di backend
}

// Type untuk update todo content/order
export interface UpdateTodoRequest {
  title?: string;
  content?: string;
  order?: Order;
}

// Type untuk update status (drag & drop)
export interface UpdateTodoStatusRequest {
  status: Status;
}

// Type untuk API responses
export interface TodoResponse {
  success: boolean;
  data: TTodo | TTodo[];
  message?: string;
}
