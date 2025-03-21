import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { SearchBar } from "../components/SearchBar";
import { TodoList } from "../components/TodoList";

import { Row, Col, Card, message, Button } from "antd";
import { Header } from "antd/es/layout/layout";

function Todos() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const handleFormSubmit = async (formData: FormData): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios
        .post("http://localhost:5000/api/todos", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          message.success("Todo added successfully!");
          setIsCreated(!isCreated);
        });
    } catch (error: any) {
      message.error("Failed to add todo!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    message.success("Logged out successfully!");
  };
  return (
    <>
      <Button
        type="primary"
        danger
        style={{ float: "right", marginTop: "20px", marginRight: "20px" }}
        onClick={handleLogout}
      >
        Log Out
      </Button>
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
            <TodoList isCreated={isCreated} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Todos;
