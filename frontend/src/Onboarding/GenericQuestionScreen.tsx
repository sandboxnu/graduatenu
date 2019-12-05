import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Box = styled.div`
  border: 1px solid black;
  padding: 18px;
  height: 225px;
  width: 400px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2``;

const Question = styled.p``;

interface Props {
  question: string;
  children: any;
}

export const GenericQuestionTemplate: React.FC<Props> = ({
  question,
  children,
}) => {
  return (
    <Wrapper>
      <Box>
        <Title>Get Started</Title>
        <Question>{question}</Question>
        {children}
      </Box>
    </Wrapper>
  );
};
