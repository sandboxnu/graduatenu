import React, { useState } from "react";
import styled from "styled-components";
import SearchIcon from "@material-ui/icons/Search";

const IconContainer = styled.div<any>`
  margin-right: ${props => (props.isSmall ? "15px" : "30px")};
  margin-top: ${props => (props.isSmall ? "4px" : "8px")};
`;

const SearchContainer = styled.div`
  border: 0px solid red;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid red;
  border-radius: 10px;
  min-width: 80%;
  background-color: white;
`;

const SearchInput = styled.input<any>`
  padding: ${props => (props.isSmall ? "5px" : "10px")};;
  margin-left: ${props => (props.isSmall ? "20px" : "50px")};
  color: black;
  border: 0px solid red;
  width: 100%;
  &:focus {
    outline: none;
  }
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: margin-left: ${props => (props.isSmall ? "10px" : "18px")};
  line-height: margin-left: ${props => (props.isSmall ? "12px" : "50px")};
`;

interface SearchProps {
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  placeholder: string;
  isSmall: boolean;
}

export const Search = (props: SearchProps) => {
  const [text, setText] = useState("");
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (props.onEnter) {
        props.onEnter(text);
      }
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        isSmall={props.isSmall}
        type="text"
        name="name"
        placeholder={props.placeholder}
        onChange={(e: any) => {
          setText(e.target.value.trim());
          if (props.onChange) {
            props.onChange(e.target.value.trim());
          }
        }}
        onKeyDown={handleKeyDown}
      />
      <IconContainer
        isSmall={props.isSmall}
        onClick={() => {
          if (props.onEnter) {
            props.onEnter(text);
          }
        }}
      >
        <SearchIcon style={{ fontSize: props.isSmall ? 24 : 28 }} />
      </IconContainer>
    </SearchContainer>
  );
};
