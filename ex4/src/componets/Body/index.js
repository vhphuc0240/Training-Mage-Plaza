import React, { useState } from "react";
import { Button, DisplayText, Page, Stack } from "@shopify/polaris";
import CreateTodoModal from "../Modal";
import ListTodo from "../ListTodo";

const initTodos = [
  {
    id: "1",
    title: "Todo 1",
    status: "pending",
  },
  {
    id: "2",
    title: "Todo 2",
    status: "pending",
  },
  {
    id: "3",
    title: "Todo 3",
    status: "pending",
  },
];
const BodyComponent = () => {
  const [isOpenModalCreateTodo, setIsOpenModalCreateTodo] = useState(false);
  const [todoList, setTodoList] = useState(initTodos);
  const handleOpenModalCreateTodo = () => {
    setIsOpenModalCreateTodo(true);
  };
  return (
    <Page>
      <Stack
        distribution="equalSpacing"
        alignment="center"
        spacing="extraLoose"
      >
        <Stack.Item fill>
          <DisplayText>Todoes</DisplayText>
        </Stack.Item>
        <Stack.Item>
          <Button primary type="success" onClick={handleOpenModalCreateTodo}>
            Create todo
          </Button>
        </Stack.Item>
      </Stack>
      <ListTodo todoList={todoList} setTodoList={setTodoList} />
      <CreateTodoModal
        isOpen={isOpenModalCreateTodo}
        setIsOpen={setIsOpenModalCreateTodo}
        todoList={todoList}
        setTodoList={setTodoList}
      />
    </Page>
  );
};

export default BodyComponent;
