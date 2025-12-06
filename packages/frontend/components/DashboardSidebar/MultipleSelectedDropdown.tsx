import React, { Dispatch, SetStateAction } from "react";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

interface MultipleSelectDropdownProps {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  options: string[];
  placeholder: string;
}

export const MultipleSelectDropdown: React.FC<MultipleSelectDropdownProps> = ({
  selected,
  setSelected,
  options,
  placeholder,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toggleMajor = (option: string) => {
    console.log("Toggling with " + option);
    console.log("Current selected:", selected);
    console.log("setSelected function type:", typeof setSelected);

    setSelected((prev: string[]) => {
      console.log("Inside setSelected callback, prev:", prev);
      const newValue = prev.includes(option)
        ? prev.filter((o: string) => o !== option)
        : [...prev, option];
      console.log("Returning newValue:", newValue);
      return newValue;
    });

    console.log("After setSelected call");
  };

  return (
    <Menu
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      closeOnSelect={false}
    >
      <MenuButton
        as={Button}
        rightIcon={
          isOpen ? (
            <ChevronUpIcon boxSize="20px" />
          ) : (
            <ChevronDownIcon boxSize="20px" />
          )
        }
        borderRadius="lg"
        border="1px"
        variant="outline"
        borderColor="primary.blue.light.main"
        colorScheme="none"
        color="black"
        width="300px"
        fontWeight="base"
        height="auto"
        padding="10px"
        my="15px"
      >
        {selected.length > 0 ? (
          <Flex flexWrap="wrap" gap={2}>
            {selected.map((option: string) => (
              <Tag
                key={option}
                size="sm"
                borderRadius="md"
                border={"1px"}
                borderColor="primary.blue.light.main"
                backgroundColor="neutral.100"
                onClick={(e) => e.stopPropagation()}
              >
                <TagLabel>{option}</TagLabel>
              </Tag>
            ))}
          </Flex>
        ) : (
          <Text textAlign={"left"}>{placeholder}</Text>
        )}
      </MenuButton>

      <MenuList
        maxH="300px"
        overflowY="auto"
        width="300px"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {options.map((option: string) => {
          const isSelected = selected.includes(option);
          return (
            <MenuItem
              key={option}
              onClick={() => toggleMajor(option)}
              bg={isSelected ? "neutral.200" : "transparent"}
              color={"black"}
              _hover={{
                bg: isSelected ? "neutral.300" : "gray.100",
              }}
            >
              <Text whiteSpace="normal" wordBreak="break-word">
                {option}
              </Text>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
