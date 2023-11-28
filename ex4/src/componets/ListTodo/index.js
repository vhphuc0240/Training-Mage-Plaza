import React, {useState} from "react";
import {
    Badge, Button, Card, DisplayText, ResourceItem, ResourceList, Stack,
} from "@shopify/polaris";
import useUpdateApi from "../../hooks/api/useUpdateApi";
import useDeleteApi from "../../hooks/api/useDeleteApi";

const ListTodo = ({todoList, setTodoList}) => {
    const {handleUpdate, updating} = useUpdateApi();
    const {handleDelete, deleting} = useDeleteApi();
    const [selectedTodos, setSelectedTodos] = useState([]);

    const resolveItemIds = ({id}) => {
        return id;
    };
    const handleCompleteTodo = async (id) => {
        setSelectedTodos((prev) => [...prev, id]);
        const newData = await handleUpdate(`/todo/${id}`, {status: "success"});
        setTodoList((prev) => prev.map((todo) => todo.id === id && todo.status !== "success" ? newData : todo));
        setSelectedTodos([]);
    };

    const handleDeleteTodo = async (id) => {
        setSelectedTodos((prev) => [...prev, id]);
        await handleDelete(`/todo/${id}`);
        setTodoList((prev) => prev.filter((todo) => todo.id !== id));
        setSelectedTodos([]);
    };
    const completedPromotedBulkActions = async () => {
        const selectedTodoToUpdate = selectedTodos.map((id => ({id, updateField: {status: "success"}})));
        await handleUpdate('todos', selectedTodoToUpdate);
        setTodoList((todos) => {
            const updatedTodos = todos.map((todo) => selectedTodos.includes(todo.id) ? {
                ...todo, status: "success",
            } : todo);
            setSelectedTodos([]);
            return updatedTodos;
        });
    };
    const deletedPromotedBulkActions = async () => {
        await handleDelete('todos', {ids: selectedTodos})
        setTodoList((todos) => todos.filter((todo) => !selectedTodos.includes(todo.id)));
        setSelectedTodos([]);
    };
    const promotedBulkActions = [{
        content: "Complete", onAction: completedPromotedBulkActions,
    }, {
        content: "Delete", onAction: deletedPromotedBulkActions,
    },];

    return (<Card>
        <ResourceList
            items={todoList}
            resourceName={{singular: "todo", plural: "todos"}}
            selectedItems={selectedTodos}
            onSelectionChange={setSelectedTodos}
            resolveItemId={resolveItemIds}
            promotedBulkActions={promotedBulkActions}
            renderItem={(todo) => (<ResourceItem id={todo.id}>
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
                                    loading={selectedTodos.includes(todo.id) && updating}
                                >
                                    Complete
                                </Button>
                            </Stack.Item>
                            <Stack.Item>
                                <Button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    destructive
                                    loading={selectedTodos.includes(todo.id) && deleting}
                                >
                                    Delete
                                </Button>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                </Stack>
            </ResourceItem>)}
        />
    </Card>);
};
export default ListTodo;
