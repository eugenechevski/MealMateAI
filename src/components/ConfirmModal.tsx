import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

import { motion } from "framer-motion";

import { useMemo } from "react";

export default function ConfirmModal({
  confirmAction,
  cancelAction,
  title,
  message,
  isConfirmationOpen,
  onConfirmationOpenChange,
}: {
  confirmAction: () => void;
  cancelAction: () => void;
  title: string;
  message: string;
  isConfirmationOpen: boolean;
  onConfirmationOpenChange: (isOpen: boolean) => void;
}) {
  return useMemo(
    () => (
      <Modal
        isOpen={isConfirmationOpen}
        placement="center"
        className="z-[100]"
        onOpenChange={onConfirmationOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="flex justify-center">{title}</ModalHeader>
          <ModalBody>
            <h2 className="font-secondary text-xl text-center whitespace-normal">{message}</h2>
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <motion.button
              className="primary-icon bg-primary-green"
              onClick={confirmAction}
            >
              <FontAwesomeIcon icon={faCheck} />
            </motion.button>
            <motion.button
              className="primary-icon bg-primary-red"
              onClick={cancelAction}
            >
              <FontAwesomeIcon icon={faClose} />
            </motion.button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ),
    [
      confirmAction,
      cancelAction,
      title,
      message,
      isConfirmationOpen,
      onConfirmationOpenChange,
    ]
  );
}
