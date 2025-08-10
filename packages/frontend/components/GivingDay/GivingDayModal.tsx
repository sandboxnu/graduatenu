import React, { useEffect, useState } from "react";
import {
  Button,
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
import {
  GIVING_DAY_LINK,
  GIVING_DAY_MODAL_HEADING,
  ITS_ALMOST_GIVING_DAY,
  MAKE_A_DONATION_DESCRIPTION,
} from "../../utils";

interface GivingDayModalProps {
  children: React.ReactElement<{ onClose: () => void }>;
}

export const GivingDayModal: React.FC<GivingDayModalProps> = ({ children }) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  // used to re-render modal after refresh so it goes on top
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  useEffect(() => {
    setShouldRender(true);
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      {children}
    </Modal>
  );
};

interface GivingDayContentProps {
  heading: string;
  hasConfetti?: boolean;
}

/** Abstract component for the Giving Day modal content. */
export const GivingDayContent = ({
  heading,
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
          <Flex paddingBottom={6} textAlign="center">
            <Text fontSize="md">{MAKE_A_DONATION_DESCRIPTION}</Text>
          </Flex>
        </VStack>
      </VStack>
      <ModalFooter padding={0}>
        <VStack width="full">
          <Button
            autoFocus
            variant="solid"
            borderRadius="md"
            width="full"
            colorScheme="red"
            onClick={() => {
              window.open(GIVING_DAY_LINK, "_blank");
            }}
          >
            Donate
          </Button>
        </VStack>
      </ModalFooter>
    </ModalContent>
  );
};

export const AlmostGivingDayModalContent = () => {
  return <GivingDayContent heading={ITS_ALMOST_GIVING_DAY} />;
};

export const GivingDayModalContent = () => {
  return (
    <GivingDayContent heading={GIVING_DAY_MODAL_HEADING} hasConfetti={true} />
  );
};
