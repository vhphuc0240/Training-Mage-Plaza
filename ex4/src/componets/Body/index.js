import React, { useState } from "react";
import styles from "./index.module.scss";
import { Button } from "@shopify/polaris";
import CreateTodoModal from "../Modal";
import ListTodo from "../ListTodo";

const BodyComponent = () => {
  const [isOpenModalCreateTodo, setIsOpenModalCreateTodo] = useState(false);
  const [todoList, setTodoList] = useState([
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
  ]);
  const handleOpenModalCreateTodo = () => {
    setIsOpenModalCreateTodo(true);
  };
  return (
    <div className={styles.body}>
      <section className={styles.bodySection}>
        <h1>Todoes</h1>
        <Button type="success" onClick={handleOpenModalCreateTodo}>
          Create todo
        </Button>
      </section>
      <ListTodo todoList={todoList} setTodoList={setTodoList} />
      <CreateTodoModal
        isOpen={isOpenModalCreateTodo}
        setIsOpen={setIsOpenModalCreateTodo}
        todoList={todoList}
        setTodoList={setTodoList}
      />
    </div>
  );
};

export default BodyComponent;
