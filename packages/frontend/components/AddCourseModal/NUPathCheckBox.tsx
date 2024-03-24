import { Checkbox, Flex, Text } from "@chakra-ui/react";
import { NUPathEnum } from "@graduate/common";
import { useMemo } from "react";

interface NUPathCheckProps {
  nuPath: keyof typeof NUPathEnum;
  selectedNUPaths: NUPathEnum[];
  setSelectedNUPaths: React.Dispatch<React.SetStateAction<NUPathEnum[]>>;
}

export const NUPathCheckBox: React.FC<NUPathCheckProps> = ({
  selectedNUPaths,
  nuPath,
  setSelectedNUPaths,
}) => {
  const isChecked = useMemo(
    () => selectedNUPaths.includes(NUPathEnum[nuPath]),
    [nuPath, selectedNUPaths]
  );

  const updateFilters = () => {
    if (isChecked) {
      setSelectedNUPaths(
        selectedNUPaths.filter((curNUPath) => curNUPath !== NUPathEnum[nuPath])
      );
    } else {
      setSelectedNUPaths([...selectedNUPaths, NUPathEnum[nuPath]]);
    }
  };

  return (
    <Checkbox
      size="md"
      colorScheme="blue"
      checked={isChecked}
      onChange={updateFilters}
      borderColor="neutral.300"
    >
      <Flex alignItems="baseline" ml="-0.5">
        <Text
          fontWeight="bold"
          color="primary.blue.light.main"
          fontSize="sm"
          marginRight="2xs"
        >
          {nuPath}
        </Text>
        <Text fontSize="sm">{NUPathEnum[nuPath]}</Text>
      </Flex>
    </Checkbox>
  );
};
