import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SearchBar } from "../components/SearchBar";
import { TodoList } from "../components/TodoList";

import { Row, Col, Card, message, Button, Spin } from "antd";
import { LogoutOutlined, PlusOutlined } from "@ant-design/icons";

import { useRequestHook } from "../hooks/useRequestHook";

const Todos: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, createTodo } = useRequestHook();
  const [isCreated, setIsCreated] = useState(false);

  const handleFormSubmit = async (formData: FormData): Promise<void> => {
    try {
      await createTodo(formData);
      setIsCreated(prev => !prev);
      message.success('Todo created successfully!');
    } catch (err) {
      message.error('Failed to create todo');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      message.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      message.error("Failed to logout");
    }
  };

  if (error) {
    message.error(error);
  }

  return (
    <Spin spinning={loading}>
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        style={{ float: "right", margin: "20px" }}
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
          xs={23}
          sm={23}
          md={21}
          lg={20}
          xl={18}
        >
          <Card 
            title="Create a new todo" 
            extra={<PlusOutlined />}
          >
            <SearchBar onFormSubmit={handleFormSubmit} />
          </Card>
        </Col>

        <Col
          xs={23}
          sm={23}
          md={21}
          lg={20}
          xl={18}
        >
          <Card title="Todo List">
            <TodoList isCreated={isCreated} />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default Todos;
