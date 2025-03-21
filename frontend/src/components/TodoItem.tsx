import React from "react";
import { Tooltip, Tag, List, Button, Popconfirm, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

import { ITodo } from "../store/todo/models/todo.models";

interface ITodoItemProps {
  todo: ITodo;
  onTodoRemoval: (todo: ITodo) => void;
  onTodoToggle: (todo: ITodo) => void;
}

export const TodoItem: React.FC<ITodoItemProps> = ({
  todo,
  onTodoRemoval,
  onTodoToggle,
}) => {
  return (
    <List.Item
      actions={[
        <Tooltip
          title={todo.completed ? "Mark as uncompleted" : "Mark as completed"}
        >
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={() => onTodoToggle(todo)}
            defaultChecked={todo.completed}
          />
        </Tooltip>,
        <Popconfirm
          title="Are you sure you want to delete?"
          onConfirm={() => {
            onTodoRemoval(todo);
          }}
        >
          <Button className="remove-todo-button" type="primary" danger>
            X
          </Button>
        </Popconfirm>,
      ]}
      className="list-item"
      key={todo._id}
    >
      <div className="todo-item">
        <Tag color={todo.completed ? "cyan" : "red"} className="todo-tag">
          {todo.title}
        </Tag>

        {todo.imageUrl && (
          <img
            src={todo.imageUrl}
            alt="Todo"
            className="todo-image"
            style={{ maxWidth: "100px", marginTop: "10px" }}
          />
        )}
        
        {todo.fileUrl && (
          <a
            href={todo.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="todo-file-link"
            style={{ display: "block", marginTop: "10px" }}
          >
            Download File
          </a>
        )}
      </div>
    </List.Item>
  );
};