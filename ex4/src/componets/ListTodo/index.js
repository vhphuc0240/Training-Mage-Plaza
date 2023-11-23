import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  DisplayText,
  ResourceItem,
  ResourceList,
} from "@shopify/polaris";

import styles from "./index.module.scss";

const ListTodo = ({ todoList, setTodoList }) => {
  const [selectedTodos, setSelectedTodos] = useState([]);
  const resolveItemIds = ({ id }) => {
    return id;
  };
  const handleCompleteTodo = (id) => {
    const newTodoList = todoList.map((todo) => {
      if (todo.id === id && todo.status !== "success") {
        return { ...todo, status: "success" };
      }
      return todo;
    });
    setTodoList(newTodoList);
  };

  const handleDeleteTodo = (id) => {
    const newTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(newTodoList);
  };
  const completedPromotedBulkActions = () => {
    setTodoList((todos) => {
      const updatedTodos = todos.map((todo) =>
        selectedTodos.includes(todo.id) ? { ...todo, status: "success" } : todo,
      );
      setSelectedTodos([]);
      return updatedTodos;
    });
  };
  const deletedPromotedBulkActions = () => {
    setTodoList((todos) =>
      todos.filter((todo) => !selectedTodos.includes(todo.id)),
    );
    setSelectedTodos([]);
  };
  const promotedBulkActions = [
    {
      content: "Complete",
      onAction: completedPromotedBulkActions,
    },
    {
      content: "Delete",
      onAction: deletedPromotedBulkActions,
    },
  ];

  useEffect(() => {
    console.log(todoList);
  }, [todoList]);

  return (
    <Card>
      <ResourceList
        items={todoList}
        resourceName={{ singular: "todo", plural: "todos" }}
        selectedItems={selectedTodos}
        onSelectionChange={setSelectedTodos}
        resolveItemId={resolveItemIds}
        promotedBulkActions={promotedBulkActions}
        renderItem={(todo) => (
          <ResourceItem id={todo.id}>
            <div className={styles.resourceList}>
              <DisplayText variant="bodyMd" fontWeight="bold" as="h3">
                {todo.title}
              </DisplayText>
              <div className={styles.right}>
                <Badge status={todo.status === "success" ? "success" : "new"}>
                  {todo.status}
                </Badge>
                <Button
                  onClick={() => handleCompleteTodo(todo.id)}
                  disabled={todo.status === "success"}
                >
                  Complete
                </Button>
                <Button onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </ResourceItem>
        )}
      />
    </Card>
  );
};
export default ListTodo;
