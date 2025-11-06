import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";
import { useState } from "react";
import { BlueButton } from "../Button";

interface SharePlanModalProps {
  plan: PlanModel<string>;
  planName: string;
}
export const SharePlanModal: React.FC<SharePlanModalProps> = ({
  plan,
  planName,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [planCode, setPlanCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const createSharingLink = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/plans/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planJson: plan }),
        credentials: "include",
      });
      const data: { planCode: string; url: string; expiresAt: string } =
        await response.json();
      setShareUrl(data.url);
      setPlanCode(data.planCode);
      setExpiresAt(data.expiresAt);
    } catch (e: any) {
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <>
      <Tooltip shouldWrapChildren label={`Share ${planName}?`} fontSize="md">
        <BlueButton
          onClick={onOpen}
          leftIcon={<DownloadIcon />}
          ml="xs"
          size="md"
        >
          Share Plan
        </BlueButton>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" color="primary.blue.dark.main">
            Share Plan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!shareUrl ? (
              <>
                <Text mb="3">
                  Generate a link to share {planName} with others?
                </Text>
                {loading && (
                  <Flex align="center" gap="2">
                    <Spinner size="sm" /> <Text>Creating link…</Text>
                  </Flex>
                )}
              </>
            ) : (
              <>
                <Text fontWeight="medium" mb="2">
                  Shareable link
                </Text>
                <Input
                  value={shareUrl}
                  readOnly
                  onFocus={(e) => e.currentTarget.select()}
                  mb="2"
                />
                {expiresAt && (
                  <Text fontSize="sm" color="gray.500">
                    Expires: {new Date(expiresAt).toLocaleString()}
                  </Text>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Flex columnGap="sm">
              <Button
                variant="solidWhite"
                size="md"
                borderRadius="lg"
                onClick={onClose}
              >
                Close
              </Button>
              {!shareUrl ? (
                <Button
                  variant="solid"
                  size="md"
                  borderRadius="lg"
                  onClick={createSharingLink}
                  isLoading={loading}
                >
                  Generate Link
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="md"
                    borderRadius="lg"
                    onClick={copyLink}
                  >
                    Copy Link
                  </Button>
                  <Button
                    as="a"
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="solid"
                    size="md"
                    borderRadius="lg"
                  >
                    Open
                  </Button>
                </>
              )}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
