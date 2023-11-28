import React, { useRef, useState } from "react";
import { Modal } from "@shopify/polaris";
import ModalSection from "../componets/Modal/ModalSection/ModalSection";

const useModal = ({ title, onConfirm, onClose, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef("");
  const CustomModal = () => (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={title}
      primaryAction={{
        content: "Create",
        onAction: () => onConfirm(inputRef.current),
        loading: loading,
      }}
      secondaryActions={{
        content: "Cancel",
        onAction: () => {
          inputRef.current = "";
          onClose(false);
        },
      }}
    >
      <ModalSection inputRef={inputRef} />
    </Modal>
  );
  return { setIsOpen, CustomModal };
};
export default useModal;
