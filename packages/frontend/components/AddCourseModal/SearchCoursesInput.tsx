import { Search2Icon } from "@chakra-ui/icons";
import {
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import {
  Dispatch,
  SetStateAction,
  KeyboardEventHandler,
  useState,
} from "react";

interface SearchCoursesInputProps {
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export const SearchCoursesInput: React.FC<SearchCoursesInputProps> = ({
  setSearchQuery,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(searchTerm);
    }
  };

  const onSubmit = () => {
    setSearchQuery(searchTerm);
  };

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="primary.blue.light.main" />
      </InputLeftElement>
      <Input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onKeyDown={onKeyDown}
        borderRadius={10}
        fontSize="sm"
        color="primary.blue.light.main"
        backgroundColor="neutral.100"
        placeholder="SEARCH BY NAME, CRN, ETC."
      />
      <InputRightElement>
        <IconButton
          aria-label="Search courses"
          backgroundColor="primary.blue.light.main"
          borderColor="primary.blue.light.main"
          colorScheme="primary.blue.light"
          icon={<Search2Icon color="white" />}
          onClick={onSubmit}
        ></IconButton>
      </InputRightElement>
    </InputGroup>
  );
};
