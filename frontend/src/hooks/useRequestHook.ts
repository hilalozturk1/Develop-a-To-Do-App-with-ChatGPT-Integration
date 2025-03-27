import { useState, useCallback } from "react";
import axios from "axios";

import { message } from "antd";

import { ITodo } from "../store/todo/models/todo.models";

interface FetchState {
  data: ITodo[];
  loading: boolean;
  error: string | null;
}

export const useRequestHook = () => {
  const [state, setState] = useState<FetchState>({
    data: [],
    loading: false,
    error: null,
  });

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You are not authenticated!");
      throw new Error("No authentication token found");
    }
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchTodos = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const headers = getAuthHeader();
      const response = await axios.get("http://localhost:5000/api/todos", {
        headers,
      });
      setState({
        data: response.data.reverse(),
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        data: [],
        loading: false,
        error: error.message,
      });
      message.error("Failed to fetch todos!");
    }
  }, [getAuthHeader]);

  const deleteTodo = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const headers = getAuthHeader();
        await axios.delete(`http://localhost:5000/api/todos/${id}`, {
          headers,
        });
        message.success("Todo deleted successfully!");
        await fetchTodos();
      } catch (error: any) {
        message.error("Failed to delete todo!");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [getAuthHeader, fetchTodos]
  );

  const updateTodo = useCallback(
    async (id: string, formData: FormData) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const headers = getAuthHeader();
        await axios.put(`http://localhost:5000/api/todos/${id}`, formData, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Todo updated successfully!");
        await fetchTodos();
      } catch (error: any) {
        message.error("Failed to update todo!");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [getAuthHeader, fetchTodos]
  );

  const toggleTodoStatus = useCallback(
    async (id: string, completed: boolean) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const headers = getAuthHeader();
        await axios.put(
          `http://localhost:5000/api/todos/${id}/completed`,
          { completed },
          { headers }
        );
        message.success(
          `Todo marked as ${completed ? "completed" : "incompleted"}!`
        );
        await fetchTodos();
      } catch (error: any) {
        message.error("Failed to update todo status!");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [getAuthHeader, fetchTodos]
  );

  const createTodo = useCallback(
    async (formData: FormData) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const headers = getAuthHeader();
        await axios.post("http://localhost:5000/api/todos", formData, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Todo created successfully!");
        await fetchTodos();
      } catch (error: any) {
        message.error("Failed to create todo!");
        setState((prev) => ({
          ...prev,
          error: error.message,
        }));
        throw error;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [getAuthHeader, fetchTodos]
  );

  return {
    ...state,
    fetchTodos,
    createTodo,
    deleteTodo,
    updateTodo,
    toggleTodoStatus,
  };
};
