import { useEffect, useState } from "react";
import axios from "axios";

import { SearchBar } from "../components/SearchBar";
import { TodoList } from "../components/TodoList";

import { Row, Col, Card, message } from "antd";
import { Header } from "antd/es/layout/layout";

import { ITodo } from "../store/todo/models/todo.models";

function Todos() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.todos);
      setLoading(false);
    } catch (error: any) {
      message.error("Failed to fetch todos!");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleFormSubmit = async (formData: FormData): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/todos",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Todo added successfully!");
      fetchTodos();
    } catch (error: any) {
      message.error("Failed to add todo!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Row
      justify="center"
      align="middle"
      gutter={[0, 20]}
      className="todos-container"
    >
      <Col
        xs={{ span: 23 }}
        sm={{ span: 23 }}
        md={{ span: 21 }}
        lg={{ span: 20 }}
        xl={{ span: 18 }}
      >
        <Header title="Add Todo" />
      </Col>

      <Col
        xs={{ span: 23 }}
        sm={{ span: 23 }}
        md={{ span: 21 }}
        lg={{ span: 20 }}
        xl={{ span: 18 }}
      >
        <Card title="Create a new todo">
          <SearchBar onFormSubmit={handleFormSubmit} />
        </Card>
      </Col>

      <Col
        xs={{ span: 23 }}
        sm={{ span: 23 }}
        md={{ span: 21 }}
        lg={{ span: 20 }}
        xl={{ span: 18 }}
      >
        <Card title="Todo List">
          <TodoList />
        </Card>
      </Col>
    </Row>
  );
}

export default Todos;
