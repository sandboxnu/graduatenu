import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import MoneyIcon from "../../public/money-icon.svg";

/** This component is for the Giving Day Accordion used on the sidebar. */
export const GivingDayAccordion = () => {
  return (
    <Accordion pb={4} allowToggle>
      <AccordionItem
        borderRadius="lg"
        backgroundColor="givingDayAccordion.back"
        border="1px #5BBF7C solid"
      >
        <AccordionButton>
          <Image src={MoneyIcon.src} alt={"money icon"} boxSize={4} mr="xs" />
          <Text fontWeight="semibold" textAlign="left" fontSize="md" flex="1">
            Giving Day!
          </Text>
          <AccordionIcon color="givingDayAccordion.main" />
        </AccordionButton>
        <AccordionPanel>
          <Text fontSize="md" paddingBottom={4}>
            {`On April 10th, make a donation to Sandbox to help keep GraduateNU – and other projects – running!`}
          </Text>

          <Button
            variant="solid"
            borderRadius="md"
            width="full"
            colorScheme="green"
            backgroundColor="givingDayAccordion.main"
            onClick={() => {
              window.open(
                "https://givingday.northeastern.edu/campaigns/sandbox-club",
                "_blank"
              );
            }}
          >
            Donate
          </Button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
