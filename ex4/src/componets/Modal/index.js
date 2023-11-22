import React, { useCallback, useState } from "react";
import { Button, Modal, TextField } from "@shopify/polaris";
import styles from "./index.module.scss";

const CreateTodoModal = ({ isOpen, setIsOpen, todoList, setTodoList }) => {
  const [fieldValue, setFieldValue] = useState("");
  const handleOnChangeFieldValue = useCallback(
    (newValue) => setFieldValue(newValue),
    [],
  );
  const handleSaveTodo = () => {
    setTodoList([
      ...todoList,
      { id: todoList.length + 1, title: fieldValue, status: "pending" },
    ]);
    setFieldValue("");
    setIsOpen(false);
  };
  const FooterModal = () => {
    return (
      <div className={styles.footerModal}>
        <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button onClick={handleSaveTodo}>Create</Button>
      </div>
    );
  };
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create a new todo"
      footer={<FooterModal />}
      iFrameName={styles.modal}
    >
      <Modal.Section>
        <TextField
          label=""
          value={fieldValue}
          onChange={handleOnChangeFieldValue}
        />
      </Modal.Section>
    </Modal>
  );
};
export default CreateTodoModal;
