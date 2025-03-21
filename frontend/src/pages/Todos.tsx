import { SearchBar } from "../components/SearchBar";
import { TodoList } from "../components/TodoList";
import { Row, Col, Card, message } from "antd";
import { ITodo } from "../store/todo/models/todo.models";
import { Header } from "antd/es/layout/layout";

function Todos() {
  const data: ITodo[] = [
    {
      name: 'Ant Design Title 1',
    },
    {
      name: 'Ant Design Title 2',
    },
    {
      name: 'Ant Design Title 3',
    },
    {
      name: 'Ant Design Title 4',
    },
  ];
  const handleFormSubmit = (todo: ITodo): void => {
    message.success("Todo added!");
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
        <Header
          title="Add Todo"
        />
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
          <TodoList
            todos={data}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default Todos;
