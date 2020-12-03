import React, { useState } from "react";
import styled from "styled-components";
import searchIcon from "../../assets/search-icon.png";

const IconContainer = styled.div`
  margin-right: 30px;
  margin-top: 8px;
`;

const SearchIcon = styled.img`
  width: 28px;
  height: 24px;
`;

const SearchContainer = styled.div`
  border: 0px solid red;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid red;
  border-radius: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-left: 50px;
  color: black;
  border: 0px solid red;
  width: 100%;
  &:focus {
    outline: none;
  }
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
`;

interface SearchProps {
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  placeholder: string;
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
      <Input
        type="text"
        name="name"
        placeholder={props.placeholder}
        onChange={e => {
          setText(e.target.value);
          if (props.onChange) {
            props.onChange(e.target.value);
          }
        }}
        onKeyDown={handleKeyDown}
      />
      <IconContainer
        onClick={_ => {
          if (props.onEnter) {
            props.onEnter(text);
          }
        }}
      >
        <SearchIcon src={searchIcon} />
      </IconContainer>
    </SearchContainer>
  );
};
