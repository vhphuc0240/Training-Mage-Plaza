import React, { useCallback, useEffect, useState } from "react";
import { Modal, TextField } from "@shopify/polaris";

const ModalSection = ({ inputRef }) => {
  const [fieldValue, setFieldValue] = useState("");

  useEffect(() => {
    inputRef.current = fieldValue;
  }, [fieldValue]);

  const handleChange = useCallback((value) => {
    setFieldValue(value);
  }, []);

  return (
    <Modal.Section>
      <TextField
        label=""
        value={fieldValue}
        onChange={handleChange}
        autoComplete="off"
      />
    </Modal.Section>
  );
};

export default ModalSection;
