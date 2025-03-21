import React from "react";

import { Table, Button, Popconfirm, Switch, Tag, Tooltip } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

import { ITodo } from "../store/todo/models/todo.models";

interface ITodoListProps {
  todos: ITodo[];
  onTodoRemoval?: (todo: ITodo) => void;
  onTodoToggle?: (todo: ITodo) => void;
}

export const TodoList: React.FC<ITodoListProps> = ({
  todos,
  onTodoRemoval = () => {},
  onTodoToggle = () => {},
}) => {
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

  return (
    <Table
      dataSource={todos}
      columns={columns}
      rowKey={(todo) => todo.id!}
      pagination={{ pageSize: 10 }}
      locale={{
        emptyText: "There's nothing to do.",
      }}
    />
  );
};
