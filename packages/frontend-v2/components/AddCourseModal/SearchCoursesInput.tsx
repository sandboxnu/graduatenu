import { Search2Icon } from "@chakra-ui/icons";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { ScheduleCourse2 } from "@graduate/common";
import { Dispatch, SetStateAction, KeyboardEventHandler } from "react";

interface SearchCoursesInputProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  searchCourses: () => void;
  setSearchResults: Dispatch<SetStateAction<ScheduleCourse2<null>[]>>;
}

export const SearchCoursesInput: React.FC<SearchCoursesInputProps> = ({
  searchTerm,
  setSearchTerm,
  searchCourses,
  setSearchResults,
}) => {
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      if (searchTerm === "") {
        setSearchResults([]);
      } else {
        searchCourses();
      }
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
