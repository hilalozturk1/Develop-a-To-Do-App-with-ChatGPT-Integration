import { Router } from 'express';
import { TodoController } from '../controllers/todoController';
import { TodoService } from '../services/todoService';
import { uploadMiddleware } from '../middlewares/fileUpload';
import { validateRequest } from '../middlewares/validateRequest';
import { z } from 'zod';
import { authenticateToken } from '../middlewares/authentication';

const router = Router();
const todoService = new TodoService();
const todoController = new TodoController(todoService);

const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    tags: z.array(z.string()).optional(),
    recommendation: z.string().optional()
  })
});

const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Todo ID is required')
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    completed: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    recommendation: z.string().optional()
  })
});

// Routes
router.use(authenticateToken);

router.post(
  '/',
  uploadMiddleware.single('file'),
  validateRequest(createTodoSchema),
  todoController.createTodo.bind(todoController)
);

router.get('/', todoController.getAllTodos.bind(todoController));

router.get('/:id', todoController.getTodoById.bind(todoController));

router.patch(
  '/:id',
  uploadMiddleware.single('file'),
  validateRequest(updateTodoSchema),
  todoController.updateTodo.bind(todoController)
);

router.delete('/:id', todoController.deleteTodo.bind(todoController));

router.patch('/:id/toggle', todoController.toggleTodoStatus.bind(todoController));

router.get('/search', todoController.searchTodos.bind(todoController));

export default router; 