import { TodoModel } from "../models/Todo";
import { ITodo } from "../types/todo";

export class TodoService {
  async createTodo(todoData: Partial<ITodo>): Promise<ITodo> {

    const editedTodoData = todoData?.body
    if (!editedTodoData?.title?.trim()) {
      throw new Error("Title required");
    }

    const todo = new TodoModel({
      title: editedTodoData.title.trim(),
      description: editedTodoData.description?.trim(),
      userId: editedTodoData.userId,
      imageUrl: editedTodoData.imageUrl,
      fileUrl: editedTodoData.fileUrl,
      tags: editedTodoData.tags || [],
      completed: false
    });

    return await todo.save();
  }

  async getAllTodos(userId: string) {
    return await TodoModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getTodoById(id: string, userId: string) {
    const todo = await TodoModel.findOne({ _id: id, userId });
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  async updateTodo(id: string, userId: string, updateData: Partial<ITodo>) {
    const todo = await TodoModel.findOne({ _id: id, userId });
    if (!todo) {
      throw new Error('Todo not found');
    }

    Object.assign(todo, {
      ...updateData.body,
      updatedAt: new Date()
    });

    await todo.save();
    return todo;
  }

  async deleteTodo(id: string, userId: string) {
    const todo = await TodoModel.findOneAndDelete({ _id: id, userId });
    if (!todo) {
      throw new Error('Todo not found');
    }
    return { message: 'Todo deleted successfully' };
  }

  async toggleTodoStatus(id: string, userId: string) {
    const todo = await TodoModel.findOne({ _id: id, userId });
    if (!todo) {
      throw new Error('Todo not found');
    }

    (todo as any).completed = !(todo as any).completed;
    todo.updatedAt = new Date();
    await todo.save();

    return todo;
  }

  async searchTodos(userId: string, query: string) {
    return await TodoModel.find({
      userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
  }
}