import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Switch, Tag, Tooltip, message } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

import axios from "axios";

import { ITodo } from "../store/todo/models/todo.models";

interface ITodoListProps {
  todos: ITodo[];
  onTodoRemoval?: (todo: ITodo) => void;
  onTodoToggle?: (todo: ITodo) => void;
}

export const TodoList: React.FC<ITodoListProps> = ({
  todos,
  onTodoToggle = () => {},
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ITodo[]>([]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You are not authenticated!");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.todos);
      setLoading(false);
      // Burada todos'u güncellemek için parent bileşene bir callback eklenebilir
    } catch (error: any) {
      message.error("Failed to fetch todos!");
      setLoading(false);
    }
  };

  const onTodoRemoval = async (todo: ITodo) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You are not authenticated!");
        return;
      }
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/todos/${todo._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Todo deleted successfully!");
      await fetchTodos(); // Silme işleminden sonra todos listesini güncelle
    } catch (error: any) {
      message.error("Failed to delete todo!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (text ? <p>{text}</p> : "No description"),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl: string) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Todo"
            style={{ maxWidth: "100px", borderRadius: "5px" }}
          />
        ) : (
          "No image"
        ),
    },
    {
      title: "File",
      dataIndex: "fileUrl",
      key: "fileUrl",
      render: (fileUrl: string) =>
        fileUrl ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
        ) : (
          "No file"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, todo: ITodo) => (
        <>
          <Tooltip
            title={todo.completed ? "Mark as uncompleted" : "Mark as completed"}
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onChange={() => onTodoToggle(todo)}
              defaultChecked={todo.completed}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => onTodoRemoval(todo)}
          >
            <Button type="primary" danger style={{ marginLeft: "10px" }}>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Table
      dataSource={data}
      columns={columns}
      loading={loading}
      rowKey={(todo) => todo._id!}
      pagination={{ pageSize: 10 }}
      locale={{
        emptyText: "There's nothing to do.",
      }}
    />
  );
};
