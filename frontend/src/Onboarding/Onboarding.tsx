import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { GraduateGrey } from "../constants";
import { Button, Card } from "@material-ui/core";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 50px;
`;

const Body = styled.div`
  display: flex;
  height: 300px;
  background-color: ${GraduateGrey};
  flex-direction: row;
  justify-content: space-around;
`;

const BodyText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;

const TitleText = styled.h2`
  margin-bottom: 2px;
`;

const DescriptionText = styled.p`
  margin-bottom: 30px;
`;

const GraduateLogo = styled.div`
  height: 200px;
  width: 200px;
  background-color: grey;
  margin: 50px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const ContentWall = styled.div`
  display: flex;
  flex: 1;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex: 6;
  margin-top: 40px;
`;

const InfoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 250px;
  width: 270px;
  border-radius: 0px !important;
`;

const PurpleHeader = styled.div`
  height: 10px;
  background-color: indigo;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  margin-left: 15px;
  margin-right: 15px;
`;

const CardTitleText = styled.h2`
  margin-bottom: 2px;
`;

export class Onboarding extends React.Component {
  renderInfoCard(title: string, desc: string) {
    return (
      <InfoCard>
        <PurpleHeader></PurpleHeader>
        <CardBody>
          <CardTitleText>{title}</CardTitleText>
          <p>{desc}</p>
        </CardBody>
      </InfoCard>
    );
  }

  render() {
    return (
      <Container>
        <Header></Header>
        <Body>
          <BodyText>
            <TitleText>Graduate, on time.</TitleText>
            <DescriptionText>
              Navigate the depths of the Northeastern graduation requirements
              and build a personalized plan of study.
            </DescriptionText>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="secondary">
                Get Started
              </Button>
            </Link>
          </BodyText>
          <GraduateLogo></GraduateLogo>
        </Body>
        <ContentWrapper>
          <ContentWall></ContentWall>
          <Content>
            {this.renderInfoCard(
              "Build",
              "Help us build a personalized multi-semester schedule by simply answering a few questions."
            )}
            {this.renderInfoCard(
              "Personalize",
              "Help us build a personalized multi-semester schedule by simply answering a few questions."
            )}
            {this.renderInfoCard(
              "Graduate",
              "Help us build a personalized multi-semester schedule by simply answering a few questions."
            )}
          </Content>
          <ContentWall></ContentWall>
        </ContentWrapper>
      </Container>
    );
  }
}
