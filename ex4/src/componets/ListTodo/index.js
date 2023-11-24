import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  DisplayText,
  ResourceItem,
  ResourceList,
  Stack,
} from "@shopify/polaris";

const ListTodo = ({ todoList, setTodoList }) => {
  const [selectedTodos, setSelectedTodos] = useState([]);
  const resolveItemIds = ({ id }) => {
    return id;
  };
  const handleCompleteTodo = (id) => {
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id && todo.status !== "success"
          ? { ...todo, status: "success" }
          : todo,
      ),
    );
  };

  const handleDeleteTodo = (id) => {
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
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
            <Stack distribution="equalSpacing" alignment="center">
              <Stack.Item>
                <DisplayText variant="bodyMd" fontWeight="bold" as="h3">
                  {todo.title}
                </DisplayText>
              </Stack.Item>
              <Stack.Item>
                <Stack alignment="center">
                  <Stack.Item>
                    <Badge
                      status={todo.status === "success" ? "success" : "new"}
                    >
                      {todo.status}
                    </Badge>
                  </Stack.Item>
                  <Stack.Item>
                    <Button
                      onClick={() => handleCompleteTodo(todo.id)}
                      disabled={todo.status === "success"}
                    >
                      Complete
                    </Button>
                  </Stack.Item>
                  <Stack.Item>
                    <Button
                      onClick={() => handleDeleteTodo(todo.id)}
                      destructive
                    >
                      Delete
                    </Button>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            </Stack>
          </ResourceItem>
        )}
      />
    </Card>
  );
};
export default ListTodo;
