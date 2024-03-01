import { NUPathEnum } from "@graduate/common";
import { Flex, Text } from "@chakra-ui/react";

interface NuPathLabelProps {
  nuPaths: NUPathEnum[];
  filteredPaths: NUPathEnum[];
}

const pathToAbbrev = (path: NUPathEnum): string => {
  switch (path) {
    case NUPathEnum.AD:
      return "AD";
    case NUPathEnum.CE:
      return "CE";
    case NUPathEnum.DD:
      return "DD";
    case NUPathEnum.EI:
      return "EI";
    case NUPathEnum.ER:
      return "ER";
    case NUPathEnum.EX:
      return "EX";
    case NUPathEnum.FQ:
      return "FQ";
    case NUPathEnum.IC:
      return "IC";
    case NUPathEnum.ND:
      return "ND";
    case NUPathEnum.SI:
      return "SI";
    case NUPathEnum.WD:
      return "WD";
    case NUPathEnum.WF:
      return "WF";
    case NUPathEnum.WI:
      return "WI";
    default:
      return path;
  }
};

export const NUPathLabel: React.FC<NuPathLabelProps> = ({
  nuPaths,
  filteredPaths,
}) => {
  if (nuPaths.length === 0) {
    return null;
  }

  return (
    <Flex justifyContent="end" gap="1" flex="1" ml="xs">
      {nuPaths.map((nuPath) => (
        <Flex
          key={nuPaths.indexOf(nuPath)}
          backgroundColor={
            filteredPaths.includes(nuPath, 0) ? "blue.100" : "gray.200"
          }
          width="6"
          height="4"
          justifyContent="center"
          alignItems="center"
          borderRadius="base"
        >
          <Text fontSize="2xs">{pathToAbbrev(nuPath)}</Text>
        </Flex>
      ))}
    </Flex>
  );
};
