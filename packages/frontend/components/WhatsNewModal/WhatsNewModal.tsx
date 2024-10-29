import React from "react";
import { Modal, ModalOverlay } from "@chakra-ui/react";

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      {children}
    </Modal>
  );
};
