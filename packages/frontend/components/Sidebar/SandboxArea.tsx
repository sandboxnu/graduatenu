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
import { toast } from "react-toastify";

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

type StoredNotes = {
  [planId: string]: string;
};

function getStoredNotes(): StoredNotes {
  const storedNotes = localStorage.getItem("notes");
  if (!storedNotes) {
    return {};
  }

  return JSON.parse(storedNotes);
}

function setStoredNotes(notes: StoredNotes) {
  try {
    localStorage.setItem("notes", JSON.stringify(notes));
  } catch (e) {
    toast.error("Maximum local storage quota exceed. Too many plans.");
  }
}

function getPlanNote(planId: string): string {
  const notesObject = getStoredNotes();
  return notesObject[planId] || "";
}

export const SandboxArea: React.FC<SandboxAreaProps> = ({ planId }) => {
  const [notes, setNotes] = useState<string>("");

  const handleNewNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!planId) return;
    setNotes(e.target.value);
    const notesObj = getStoredNotes();
    notesObj[planId] = e.target.value;
    setStoredNotes(notesObj);
  };

  useEffect(() => {
    if (!planId) return;
    setNotes(getPlanNote(String(planId)));
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
