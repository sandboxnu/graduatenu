import React from "react";
import { InfoIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";

const ConcentrationDropdownWarning = () => {
  return (
    <Accordion pb="sm" allowToggle>
      <AccordionItem
        borderRadius="lg"
        backgroundColor="red"
        border="1px #5F6CF6 solid"
      >
        <AccordionButton>
          <InfoIcon mr="xs" color="blue" />
          <Text fontWeight="semibold" textAlign="left" fontSize="md" flex="1">
            Missing Concentration!
          </Text>
          <AccordionIcon color="black" />
        </AccordionButton>
        <AccordionPanel>
          <Text fontSize="sm">
            A concentration is required for this major. Go to &apos;Edit
            plan&apos; and select your desired concentration from the drop-down
            menu.
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ConcentrationDropdownWarning;
