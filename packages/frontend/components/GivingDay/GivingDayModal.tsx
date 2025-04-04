import React from "react";
import {
  Box,
  Button,
  Link,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Image,
  Text,
  VStack,
  Heading,
  Flex,
  useTheme,
  useDisclosure,
} from "@chakra-ui/react";
import DonateGraduateHusky from "../../public/donate-graduate-husky.svg";
import ConfettiExplosion from "react-confetti-explosion";

interface GivingDayModalProps {
  children: React.ReactElement<{ onClose: () => void }>;
}

export const GivingDayModal: React.FC<GivingDayModalProps> = ({ children }) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      {React.cloneElement(children, { onClose })}
    </Modal>
  );
};

interface ModalContentProps {
  onClose: () => void;
}

interface GivingDayContentProps {
  heading: string;
  body: React.ReactNode;
  footer: React.ReactNode;
  hasConfetti?: boolean;
}

/** Abstract component for the Giving Day modal content. */
export const GivingDayContent = ({
  heading,
  body,
  footer,
  hasConfetti = false,
}: GivingDayContentProps) => {
  const theme = useTheme();

  return (
    <ModalContent padding={5}>
      <ModalHeader>
        <ModalCloseButton />
      </ModalHeader>
      <VStack>
        <Image
          src={DonateGraduateHusky.src}
          alt={"graduatenu husky"}
          fit={"contain"}
          maxWidth={400}
          maxHeight={300}
          borderRadius="2xl"
        />
        {hasConfetti && (
          <ConfettiExplosion
            {...{
              force: 0.5,
              duration: 3000,
              particleCount: 80,
              width: 400,
              zIndex: theme.zIndices.popover,
            }}
          />
        )}
        <VStack>
          <Heading size="lg">{heading}</Heading>
          {body}
        </VStack>
      </VStack>
      <ModalFooter padding={0}>{footer}</ModalFooter>
    </ModalContent>
  );
};

export const AlmostGivingDayModalContent = ({ onClose }: ModalContentProps) => {
  return (
    <GivingDayContent
      heading="It's almost Giving Day!"
      body={
        <Flex paddingBottom={6}>
          <Text fontSize="md">
            {`On April 10th, make a donation to Sandbox `}
            <Box as="br" />
            <Link
              href="https://givingday.northeastern.edu/campaigns/sandbox-club"
              color="blue.500"
              isExternal
            >
              here
            </Link>
            {` to help keep GraduateNU running!`}
          </Text>
        </Flex>
      }
      footer={
        <Button
          variant="solid"
          borderRadius="md"
          width="full"
          colorScheme="red"
          onClick={onClose}
        >
          Okay
        </Button>
      }
    />
  );
};

export const GivingDayModalContent = ({ onClose }: ModalContentProps) => {
  return (
    <GivingDayContent
      heading="It's Giving Day!"
      body={
        <Flex textAlign="center" paddingBottom={6} margin={0}>
          <Text fontSize="md">
            {`Make a donation to Sandbox to help keep GraduateNU running!`}
          </Text>
        </Flex>
      }
      footer={
        <VStack width="full">
          <Button
            variant="solid"
            borderRadius="md"
            width="full"
            colorScheme="red"
            onClick={() => {
              window.open(
                "https://givingday.northeastern.edu/campaigns/sandbox-club",
                "_blank"
              );
              onClose();
            }}
          >
            Donate
          </Button>
          <Button
            variant="solidWhite"
            size="md"
            borderRadius="md"
            width="full"
            onClick={onClose}
            padding={0}
            _hover={{
              backgroundColor: "neutral.100",
            }}
          >
            Maybe Later
          </Button>
        </VStack>
      }
      hasConfetti={true}
    />
  );
};
