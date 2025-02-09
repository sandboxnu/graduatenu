import { ChevronDownIcon, ChevronUpIcon, WarningIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, Collapse } from "@chakra-ui/react";
import { useState } from "react";

interface ErrorModalErrorProps {
  title: string;
  message: string;
}

export const ErrorModalError: React.FC<ErrorModalErrorProps> = ({
  title,
  message,
}) => {
  const [opened, setOpened] = useState(false);

  return (
    <Box
      border="1px solid"
      borderColor="primary.red.main"
      borderRadius="lg"
      backgroundColor="#FAE8E7"
      transition="background-color 0.25s ease"
      _hover={{ backgroundColor: "#F9DAD8" }}
    >
      <Flex
        onClick={() => setOpened(!opened)}
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        height="45px"
        color="black"
        fontWeight="bold"
        p="sm"
        position="sticky"
        top="0px"
        zIndex={1}
      >
        <Flex direction="row" height="100%" columnGap="sm">
          <Flex direction="row" height="100%" alignItems="center" gap="1">
            <WarningIcon
              color="primary.red.main"
              width="2rem"
              alignSelf="center"
              alignItems="center"
              justifySelf="center"
              transition="background 0.15s ease"
            />
            <Text color="black" mt="0" fontSize="sm">
              {title}
            </Text>
          </Flex>
        </Flex>

        <Flex ml="xs" alignItems="center" justifyItems="center">
          {opened ? (
            <ChevronUpIcon boxSize="25px" color="primary.red.main" />
          ) : (
            <ChevronDownIcon boxSize="25px" color="primary.red.main" />
          )}
        </Flex>
      </Flex>

      <Collapse in={opened} animateOpacity>
        <Box px="sm" py="xs" borderRadius="lg" backgroundColor="transparent">
          <Text fontSize="sm">{message}</Text>
        </Box>
      </Collapse>
    </Box>
  );
};
