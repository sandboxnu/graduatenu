import { Search2Icon } from "@chakra-ui/icons";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
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

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="primary.blue.light.main" />
      </InputLeftElement>
      <Input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value.trim());
        }}
        onKeyDown={onKeyDown}
        borderRadius={10}
        fontSize="sm"
        color="primary.blue.light.main"
        backgroundColor="neutral.main"
        placeholder="SEARCH BY NAME, CRN, ETC."
      />
    </InputGroup>
  );
};
