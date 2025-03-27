import { TodoModel } from '../models/Todo';
import { ITodo } from '../types/todo';

export class TodoService {
  async createTodo(todoData: Partial<ITodo>) {
    if (!todoData.title || !todoData.description || !todoData.userId) {
      throw new Error('Title, description and userId are required');
    }

    const existingTodo = await TodoModel.findOne({ 
      title: todoData.title,
      userId: todoData.userId 
    });
    if (existingTodo) {
      throw new Error('Todo with this title already exists');
    }

    const todo = await TodoModel.create({
      ...todoData,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return todo;
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

    if (updateData.title && updateData.title !== todo.title) {
      const existingTodo = await TodoModel.findOne({ 
        title: updateData.title,
        userId,
        _id: { $ne: id }
      });
      if (existingTodo) {
        throw new Error('Todo with this title already exists');
      }
    }

    Object.assign(todo, {
      ...updateData,
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

    todo.completed = !todo.completed;
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