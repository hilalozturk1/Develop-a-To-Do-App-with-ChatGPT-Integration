import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todoService';

export class TodoController {
  constructor(private todoService: TodoService) {}

  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await this.todoService.createTodo(req.body);
      return res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  }
}