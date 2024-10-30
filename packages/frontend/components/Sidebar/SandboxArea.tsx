import {
  Box,
  VStack,
  Flex,
  Image,
  Text,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";
import { forwardRef, useEffect, useState } from "react";
import ResizeTextarea from "react-textarea-autosize";

// Still a bit buggy
const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <Textarea
        minH="unset"
        w="100%"
        ref={ref}
        minRows={4}
        as={ResizeTextarea}
        maxRows={10}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";

interface SandboxAreaProps {
  planId: string | number;
}

export const SandboxArea: React.FC<SandboxAreaProps> = ({ planId }) => {
  const [notes, setNotes] = useState<string>("");
  const handleNewNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!planId) return;
    setNotes(e.target.value);
    // Retrieve existing notes from localStorage
    const storedNotes = localStorage.getItem("notes");
    const notesObject = storedNotes ? JSON.parse(storedNotes) : {};
    notesObject[planId] = notes;
    // have a notes object plan_id (number | string) -> note (string)
    localStorage.setItem("notes", JSON.stringify(notesObject));
    //console.log("New notes: ", e.target.value);
  };

  useEffect(() => {
    if (!planId) return;
    const storedNotes = localStorage.getItem("notes");
    const notesObject = storedNotes ? JSON.parse(storedNotes) : {};
    if (storedNotes) {
      setNotes(notesObject[planId]);
    }
  }, [planId]);
  return (
    <Box backgroundColor="white" pt="6" pb="6" px="3">
      <VStack align="left" px="4">
        <Flex mb="3">
          <Image src="/sandbox_logo.svg" alt="sandbox logo" mr="2" />
          <Text color="primary.blue.dark.main" fontSize="sm" fontWeight="bold">
            Sandbox Area
          </Text>
        </Flex>
        <Text color="primary.blue.dark.main" fontSize="sm" fontWeight="bold">
          Notes
        </Text>
        <AutoResizeTextarea
          placeholder="notes here!"
          resize="vertical"
          height="initial"
          value={notes}
          onChange={handleNewNotes}
        />
      </VStack>
    </Box>
  );
};
