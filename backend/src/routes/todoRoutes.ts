import { Router } from "express";
import { TodoController } from "../controllers/todoController";
import { TodoService } from "../services/todoService";
import { uploadMiddleware } from "../middlewares/fileUpload";
import { validateRequest } from "../middlewares/validateRequest";
import { z } from "zod";
import { authenticateToken } from "../middlewares/authentication";
import { createTodoSchema, updateTodoSchema } from "../models/Todo";

const router = Router();
const todoService = new TodoService();
const todoController = new TodoController(todoService);

// Routes
router.use(authenticateToken);

router.post(
  "/",
  uploadMiddleware,
  validateRequest(createTodoSchema),
  todoController.createTodo.bind(todoController)
);

router.get("/", todoController.getAllTodos.bind(todoController));

router.get("/:id", todoController.getTodoById.bind(todoController));

router.put(
  "/:id",
  uploadMiddleware,
  validateRequest(updateTodoSchema),
  todoController.updateTodo.bind(todoController)
);

router.delete("/:id", todoController.deleteTodo.bind(todoController));

router.put(
  "/:id/completed",
  todoController.toggleTodoStatus.bind(todoController)
);

router.get("/search", todoController.searchTodos.bind(todoController));

export default router;
