import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";
import { ITodo } from "../types/todo";

const todoSchemaZod = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  userId: z.string(),
  imageUrl: z.string().optional(),
  fileUrl: z.string().optional(),
  recommendation: z.string().optional(),
  tags: z.array(z.string()).optional(),
  completed: z.boolean().default(false),
});

const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String,
      required: true,
      trim: true 
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
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const TodoModel = mongoose.model<ITodo>("Todo", todoSchema);

const validateTodo = (todoData: unknown) => {
  return todoSchemaZod.safeParse(todoData);
};

export { validateTodo, TodoModel };
