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

const DropdownWarning = () => {
  return (
    <Accordion pb="sm" allowToggle>
      <AccordionItem
        borderRadius="lg"
        backgroundColor="informationBadge.back"
        border="1px #5F6CF6 solid"
      >
        <AccordionButton>
          <InfoIcon mr="xs" color="informationBadge.main" />
          <Text fontWeight="semibold" textAlign="left" fontSize="md" flex="1">
            Heads up!
          </Text>
          <AccordionIcon color="informationBadge.main" />
        </AccordionButton>
        <AccordionPanel>
          <Text fontSize="sm">
            This is our representation of the degree audit. It may not be fully
            accurate. Kindly always reference the actual degree audit for
            validating your graduation eligibility. We are actively working to
            improve this.
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DropdownWarning;
