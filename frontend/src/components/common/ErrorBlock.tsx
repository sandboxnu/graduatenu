import React from "react";
import styled from "styled-components";
import advisingErrorPic from "../../assets/advising-error.png";

const ErrorContainer = styled.div`
  margin-top: 30px;
  border: 1px solid red;
  border-radius: 10px;
  width: auto;
  padding: 20px;
  background-color: #ececec 
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
`;

const ErrorTextContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  max-height: 20%;
  min-height: 100px;
  max-width: 270px;
  padding: 15px;
`;

const ErrorTitle = styled.div`
  font-weight: 900;
  font-size: 2em;
  color: #eb5757;
  text-align: left;
`;

const ErrorMessage = styled.div`
  font-weight: 900;
  font-size: 0.9em;
  color: #808080;
  text-align: left;
`;

const ErrorImage = styled.img`
  max-height: 20%;
  min-height: 100px;
`;

/**
 * A general use error component with Oh No text, a message, and an error doggo
 */
export class ErrorBlock extends React.Component {
  render() {
    return (
      <ErrorContainer>
        <ErrorImage src={advisingErrorPic} alt="Error Doggo" />
        <ErrorTextContainer>
          <ErrorTitle>Oh no!</ErrorTitle>
          <ErrorMessage>
            We are unable to retrieve the information you need. Please refresh
            your browser. If the problem persists, contact us here.
          </ErrorMessage>
        </ErrorTextContainer>
      </ErrorContainer>
    );
  }
}
