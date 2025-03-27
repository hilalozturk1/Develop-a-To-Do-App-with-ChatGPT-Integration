import { NextFunction, RequestHandler } from "express";
import { TodoService } from "../services/todoService";

export class TodoController {
  constructor(private todoService: TodoService) {}

  createTodo: RequestHandler = async (
    req: any,
    res: any,
    next: NextFunction
  ) => {
    try {
      const todoData = {
        ...req.body,
        userId: req.user.userId,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      const todo = await this.todoService.createTodo(todoData);
      return res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  };

  getAllTodos: RequestHandler = async (req: any, res: any, next) => {
    try {
      const todos = await this.todoService.getAllTodos(req.user.userId);
      return res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  };

  getTodoById: RequestHandler = async (req: any, res: any, next) => {
    try {
      const todo = await this.todoService.getTodoById(
        req.params.id,
        req.user.userId
      );
      return res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  };

  updateTodo: RequestHandler = async (req: any, res: any, next) => {
    try {
      const updateData = {
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      const todo = await this.todoService.updateTodo(
        req.params.id,
        req.user.userId,
        updateData
      );
      return res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  };

  deleteTodo: RequestHandler = async (req: any, res: any, next) => {
    try {
      const result = await this.todoService.deleteTodo(
        req.params.id,
        req.user.userId
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  toggleTodoStatus: RequestHandler = async (req: any, res: any, next) => {
    try {
      const todo = await this.todoService.toggleTodoStatus(
        req.params.id,
        req.user.userId
      );
      return res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  };

  searchTodos: RequestHandler = async (req: any, res: any, next) => {
    try {
      const todos = await this.todoService.searchTodos(
        req.user.userId,
        req.query.q as string
      );
      return res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  };
}
