import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export interface ITodo extends Document {
  title: string;
  description?: string;
  userId: mongoose.Schema.Types.ObjectId;
  imageUrl?: string;
  fileUrl?: string;
  recommendation?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const todoSchemaZod = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  userId: z.string().nonempty("User ID is required"),
  imageUrl: z.string().url().optional(),
  fileUrl: z.string().url().optional(),
  recommendation: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const todoSchema: Schema<ITodo> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String },
    fileUrl: { type: String },
    recommendation: { type: String },
    tags: { type: [String] },
  },
  { timestamps: true }
);

const TodoModel = mongoose.model<ITodo>("Todo", todoSchema);

const validateTodo = (todoData: unknown) => {
  return todoSchemaZod.safeParse(todoData);
};

export { validateTodo, TodoModel };
