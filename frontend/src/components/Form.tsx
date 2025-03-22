import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "antd/es/layout/layout";

const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log("onfinish");
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/${isLogin ? "login" : "register"}`,
        values
      );
      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        navigate("/todos");
      } else {
        message.success("User registered successfully");
        setIsLogin(true);
      }
    } catch (error: any) {
      message.error(error.response?.data.message || "An error occurred");
    }
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
    >
      <h2> {isLogin ? "Log in Page" : "Register Page"}</h2>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          {isLogin ? "Log in" : "Register"}
        </Button>
        or{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? "Register" : "Log in"}
        </a>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
