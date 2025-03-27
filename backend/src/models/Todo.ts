import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";
import { ITodo } from "../types/todo";

const todoSchemaZod = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  userId: z.string(),
  imageUrl: z.string().optional(),
  fileUrl: z.string().optional(),
  recommendation: z.string().optional(),
  tags: z.array(z.string()).optional(),
  completed: z.boolean().default(false),
});

const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    userId: z.string().optional(),
    imageUrl: z.string().optional(),
    fileUrl: z.string().optional(),
    tags: z.array(z.string()).optional(),
    completed: z.boolean().optional().default(false),
  }),
});

const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Todo ID is required"),
  }),
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    completed: z.boolean().optional(),
    imageUrl: z.string().optional(),
    fileUrl: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String },
    fileUrl: { type: String },
    recommendation: { type: String },
    tags: { type: [String] },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const TodoModel = mongoose.model<ITodo>("Todo", todoSchema);

const validateTodo = (todoData: unknown) => {
  return todoSchemaZod.safeParse(todoData);
};

export {
  validateTodo,
  TodoModel,
  todoSchemaZod,
  createTodoSchema,
  updateTodoSchema,
};
