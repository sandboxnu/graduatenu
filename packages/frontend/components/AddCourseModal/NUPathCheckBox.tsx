import { Checkbox, HStack, Text } from "@chakra-ui/react";

interface NUPathCheckProps {
  abbreviation: string;
  label: string;
}

export const NUPathCheckBox: React.FC<NUPathCheckProps> = ({
  abbreviation,
  label,
}) => {
  return (
    <Checkbox size="lg" colorScheme="blue">
      <HStack>
        <Text fontWeight="bold" color="blue.500" fontSize="sm" margin="0">
          {abbreviation}
        </Text>
        <Text fontSize="xs">{label}</Text>
      </HStack>
    </Checkbox>
  );
};
