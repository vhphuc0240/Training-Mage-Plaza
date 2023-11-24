import React, { useCallback, useState } from "react";
import { Button, Modal, Stack, TextField } from "@shopify/polaris";

const CreateTodoModal = ({ isOpen, setIsOpen, todoList, setTodoList }) => {
  const [fieldValue, setFieldValue] = useState("");
  const handleOnChangeFieldValue = useCallback(
    (newValue) => setFieldValue(newValue),
    [],
  );
  const handleSaveTodo = () => {
    setTodoList([
      ...todoList,
      {
        id: Math.floor(Math.random() * 10000).toString(),
        title: fieldValue,
        status: "pending",
      },
    ]);
    setFieldValue("");
    setIsOpen(false);
  };
  const FooterModal = () => {
    return (
      <Stack alignment="center" distribution="trailing">
        <Stack.Item>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        </Stack.Item>
        <Stack.Item>
          <Button primary onClick={handleSaveTodo}>
            Create
          </Button>
        </Stack.Item>
      </Stack>
    );
  };
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create a new todo"
      footer={<FooterModal />}
    >
      <Modal.Section>
        <TextField
          label=""
          value={fieldValue}
          onChange={handleOnChangeFieldValue}
          autoComplete="off"
        />
      </Modal.Section>
    </Modal>
  );
};
export default CreateTodoModal;
