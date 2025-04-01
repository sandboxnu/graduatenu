import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
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
      <Tooltip label={`Export ${planName}?`} fontSize="md">
        <IconButton
          icon={<DownloadIcon />}
          style={{ transform: "rotate(180deg)" }}
          aria-label="Export plan"
          variant="outline"
          border="1px"
          borderColor="#32CD32"
          colorScheme="#32CD32"
          color="#32CD32"
          ml="xs"
          borderRadius="lg"
          onClick={onOpen}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" color="primary.blue.dark.main">
            Export Plan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to export {planName}?</ModalBody>
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
                backgroundColor="#32CD32"
              >
                Export
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
