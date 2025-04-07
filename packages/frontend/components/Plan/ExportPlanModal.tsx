import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";
import { BlueButton } from "../Button";

interface ExportPlanModalProps {
  plan: PlanModel<String>;
  planName: string;
}
interface DownloadPlanParams {
  data: string;
  fileName: string;
  fileType: string;
}
export const ExportPlanModal: React.FC<ExportPlanModalProps> = ({
  plan,
  planName,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const downloadPlan = async ({
    data,
    fileName,
    fileType,
  }: DownloadPlanParams) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const exportToJson = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    downloadPlan({
      data: JSON.stringify(plan),
      fileName: planName + ".json",
      fileType: "text/json",
    });
  };

  return (
    <>
      <Tooltip shouldWrapChildren label={`Export ${planName}?`} fontSize="md">
        <BlueButton
          onClick={onOpen}
          leftIcon={<DownloadIcon />}
          ml="xs"
          size="md"
        >
          Export Plan
        </BlueButton>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" color="primary.blue.dark.main">
            Export Plan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody margin="auto">
            Export plan '{planName}' as a JSON file?
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Flex columnGap="sm">
              <Button
                variant="solidWhite"
                size="md"
                borderRadius="lg"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                size="md"
                borderRadius="lg"
                type="submit"
                onClick={exportToJson}
              >
                Export Plan
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
