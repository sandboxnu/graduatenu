import { Checkbox, HStack, Text } from "@chakra-ui/react";
import { NUPathEnum } from "@graduate/common";
import { useState } from "react";

interface NUPathCheckProps {
  abbreviation: string;
  label: string;
  filteredPaths: NUPathEnum[];
  associatedPath: NUPathEnum;
  setPathState?: React.Dispatch<React.SetStateAction<any>>;
}

export const NUPathCheckBox: React.FC<NUPathCheckProps> = ({
  abbreviation,
  label,
  filteredPaths,
  associatedPath,
  setPathState,
}) => {
  const [isChecked, setChecked] = useState<boolean>(false);

  const updateFilters = () => {
    console.log("triggered update filters");
    if (isChecked) {
      removePathFilter(associatedPath);
    } else {
      addPathFilter(associatedPath);
    }
  };

  const addPathFilter = (path: NUPathEnum) => {
    const updatedPaths = [...filteredPaths];
    updatedPaths.push(path);

    setChecked(true);

    if (setPathState != null) setPathState(updatedPaths);
  };

  const removePathFilter = (path: NUPathEnum) => {
    const updatedPaths = filteredPaths.filter(
      (selectedPath) => selectedPath != path
    );

    setChecked(false);

    if (setPathState != null) setPathState(updatedPaths);
  };

  return (
    <Checkbox
      size="lg"
      colorScheme="blue"
      checked={isChecked}
      onChange={updateFilters}
    >
      <HStack>
        <Text fontWeight="bold" color="blue.500" fontSize="sm" margin="0">
          {abbreviation}
        </Text>
        <Text fontSize="xs">{label}</Text>
      </HStack>
    </Checkbox>
  );
};
