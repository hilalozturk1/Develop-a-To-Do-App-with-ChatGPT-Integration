import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Switch,
  Tag,
  Tooltip,
  message,
  Modal,
  Form,
  Input,
  Upload,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";

import { ITodo } from "../store/todo/models/todo.models";

interface TodoListProps {
  isCreated: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({ isCreated }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ITodo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
  const [imageList, setImageList] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

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
      setData(response.data.reverse());
      setLoading(false);
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
      await fetchTodos();
    } catch (error: any) {
      message.error("Failed to delete todo!");
    } finally {
      setLoading(false);
    }
  };

  const onEditTodo = (todo: ITodo) => {
    setEditingTodo(todo);
    setImageList([]);
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEditSubmit = async (values: {
    title: string;
    description: string;
  }) => {
    if (!editingTodo) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You are not authenticated!");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);

      if (imageList.length > 0) {
        formData.append("image", imageList[0].originFileObj);
      }

      if (fileList.length > 0) {
        formData.append("file", fileList[0].originFileObj);
      }

      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/todos/${editingTodo._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Todo updated successfully!");
      setIsModalVisible(false);
      setEditingTodo(null);
      await fetchTodos();
    } catch (error: any) {
      message.error("Failed to update todo!");
    } finally {
      setLoading(false);
    }
  };

  const onTodoToggle = async (todo: ITodo) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You are not authenticated!");
        return;
      }

      const updatedCompleted = !todo.completed;

      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/todos/${todo._id}/completed`,
        { completed: updatedCompleted },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success(
        `Todo marked as ${updatedCompleted ? "completed" : "incompleted"}!`
      );
      await fetchTodos();
    } catch (error: any) {
      message.error("Failed to update todo status!");
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
      title: "Recommendation",
      dataIndex: "recommendation",
      key: "recommendation",
      render: (text: string) => (text ? <p>{text}</p> : "No recommendation"),
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
          <Button
            type="default"
            style={{ marginLeft: "10px" }}
            onClick={() => onEditTodo(todo)}
          >
            Edit
          </Button>
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
  }, [isCreated]);

  return (
    <>
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
      <Modal
        title="Edit Todo"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTodo(null);
        }}
        footer={null}
      >
        <Form
          initialValues={{
            title: editingTodo?.title,
            description: editingTodo?.description,
          }}
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              accept="image/*"
              maxCount={1}
              fileList={imageList}
              onChange={({ fileList }) => setImageList(fileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="File">
            <Upload
              accept=".pdf,.doc,.docx,.txt"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "10px" }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setIsModalVisible(false);
                setEditingTodo(null);
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
