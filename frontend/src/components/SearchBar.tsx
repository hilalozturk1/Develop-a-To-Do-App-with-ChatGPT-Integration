import React, { useState } from "react";

import { Form, Row, Col, Button, Input, Upload } from "antd";
import { PlusCircleFilled, UploadOutlined } from "@ant-design/icons";
interface IAddTodoFormProps {
  onFormSubmit: (formData: FormData) => void;
}

export const SearchBar: React.FC<IAddTodoFormProps> = ({ onFormSubmit }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageList, setImageList] = useState<any[]>([]);

  const onFinish = () => {
    const formData = new FormData();

    formData.append("name", form.getFieldValue("name"));
    formData.append("description", form.getFieldValue("description"));

    if (imageList.length > 0) {
      formData.append("image", imageList[0].originFileObj);
    }

    if (fileList.length > 0) {
      formData.append("file", fileList[0].originFileObj);
    }

    onFormSubmit(formData);
    setFileList([]);
    setImageList([]);

    form.resetFields();
  };
  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleImageChange = ({ fileList }: any) => {
    setImageList(fileList);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="horizontal"
      className="todo-form w-100"
    >
      <Row gutter={20}>
        <Col xs={24} sm={24} md={17} lg={19} xl={20}>
          <Form.Item
            name={"name"}
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input placeholder="What needs to be done?" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name={"description"}
            rules={[{ required: true, message: "Please provide a description!" }]}
          >
            <Input.TextArea placeholder="Add a description" rows={4} />
          </Form.Item>
        </Col>
        <Col>
          <Upload
            accept="image/*"
            maxCount={1}
            fileList={imageList}
            onChange={handleImageChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Col>

        <Col>
          <Upload
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            maxCount={1}
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        </Col>
        <Col>
          <Button type="primary" htmlType="submit" block>
            <PlusCircleFilled />
            Add todo
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
