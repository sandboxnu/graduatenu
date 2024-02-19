import { NUPathEnum } from "@graduate/common";
import { Flex, Text } from "@chakra-ui/react";

interface NuPathLabelProps {
  nupaths: NUPathEnum[];
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
  nupaths,
  filteredPaths,
}) => {
  return (
    <Flex
      justifyContent="end"
      align="center"
      flexGrow="1"
      gap="1"
      marginRight="5"
    >
      {nupaths.map((nuPath) => (
        <Flex
          key={nupaths.indexOf(nuPath)}
          backgroundColor={
            filteredPaths.includes(nuPath, 0) ? "blue.200" : "gray.200"
          }
          width="7"
          height="5"
          justifyContent="center"
          alignItems="center"
          borderRadius="md"
        >
          <Text fontSize="xs">{pathToAbbrev(nuPath)}</Text>
        </Flex>
      ))}
    </Flex>
  );
};
