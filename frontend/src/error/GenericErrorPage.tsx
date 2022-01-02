import React from "react";
import styled from "styled-components";
import sadface from "../assets/white-frown.svg";
import { WhiteColorButton } from "../components/common/ColoredButtons";
import { useHistory } from "react-router";
import { Refresh } from "@material-ui/icons";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  border-bottom: 1px solid #eb5757;
  padding: 12px;
`;

const HomeText = styled.a`
  font-weight: bold;
  font-size: 36px;
  text-decoration: none;
  color: black;
`;

const ErrorBox = styled.div`
  background-color: #eb5757;
  height: 50%;
  margin: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px;
`;

const SadFace = styled.img`
  margin: 60px;
  max-width: 50%;
  height: auto;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  max-width: 50%;
`;

const OhNo = styled.div`
  color: white;
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const Message = styled.div`
  color: white;
  font-size: large;
  margin: 10px 0;
`;

const CustomLink = styled.a`
  color: white;
  text-decoration: underline;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  margin: 15px 0;
  width: 100%;
`;

export const GenericErrorPage = ({ message }: { message: string }) => {
  const history = useHistory();
  return (
    <>
      <Header>
        <HomeText>GraduateNU</HomeText>
      </Header>
      <ErrorBox>
        <ContentWrapper>
          <SadFace src={sadface} alt="Sad Face" />
          <MessageWrapper>
            <OhNo>Oh no!</OhNo>
            <Message>{message}</Message>
            <Message>
              Please&nbsp;
              <CustomLink onClick={() => history.go(0)}>
                refresh your browser
                <Refresh />
              </CustomLink>
            </Message>
            <Message>
              If the problem persists, please contact us&nbsp;
              <CustomLink href="mailto:luo.jus@northeastern.edu">
                here.
              </CustomLink>
            </Message>

            <ButtonWrapper>
              <WhiteColorButton onClick={() => history.goBack()}>
                Take me Back
              </WhiteColorButton>
            </ButtonWrapper>
          </MessageWrapper>
        </ContentWrapper>
      </ErrorBox>
    </>
  );
};
