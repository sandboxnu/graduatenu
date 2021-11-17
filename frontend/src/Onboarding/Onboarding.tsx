import React from "react";
import styled from "styled-components";
import { Button, Theme, withStyles } from "@material-ui/core";
import titlePicture from "../assets/onboarding-title.png";
import picture1 from "../assets/onboarding-1.png";
import picture2 from "../assets/onboarding-2.png";
import picture3 from "../assets/onboarding-3.png";
import { NORTHEASTERN_RED } from "../constants";
import {
  simulateKhouryAdvisorLogin,
  simulateKhouryStudentLogin,
} from "../services/UserService";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 5%;
  padding-right: 5%;
  justify-content: space-between;
  align-items: center;
`;

const LoginButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Banner = styled.div`
  background-color: ${NORTHEASTERN_RED};
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const BannerInfo = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 16px;
`;

const BannerInfoTitle = styled.h1`
  color: white;
  margin-bottom: -8px;
`;

const BannerInfoText = styled.h4`
  color: white;
`;

const TitlePicture = styled.img`
  width: 300px;
  height: 300px;
  align-self: center;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20%;
  margin-right: 20%;
  margin-top: 24px;
  margin-bottom: 32px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const InfoText = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const InfoPictureWrapper = styled.div`
  display: flex;
  width: 50%;
  align-items: center;
  justify-content: center;
`;

const InfoPicture = styled.img`
  width: 250px;
  height: 167px;
  align-self: center;
`;

const InfoTextTitle = styled.h3`
  margin-bottom: -8px;
`;

const Footer = styled.div`
  background-color: ${NORTHEASTERN_RED};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  padding-left: 80px;
  padding-right: 80px;
  justify-content: flex-end;
`;

const WhiteColorButton = withStyles((theme: Theme) => ({
  root: {
    color: NORTHEASTERN_RED,
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#e9e9e9",
    },
  },
}))(Button);

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: "#ffffff",
    backgroundColor: NORTHEASTERN_RED,
    "&:hover": {
      backgroundColor: "#DB4747",
    },
  },
}))(Button);

interface Props {
  fullName: string;
}

export class Onboarding extends React.Component<Props> {
  dev: boolean;

  constructor(props: Props) {
    super(props);
    this.state = {
      redirectUrl: undefined,
    };

    this.dev = process.env.NODE_ENV === "development";
  }

  onDevStudentClick() {
    simulateKhouryStudentLogin().then(response => {
      window.location.href = response.redirect;
    });
  }

  onDevAdvisorClick() {
    simulateKhouryAdvisorLogin().then(response => {
      window.location.href = response.redirect;
    });
  }

  renderInfoSection(
    title: string,
    desc: string,
    picture: string,
    flipped = false
  ) {
    if (flipped) {
      return (
        <InfoSection>
          <InfoText>
            <InfoTextTitle>{title}</InfoTextTitle>
            <p>{desc}</p>
          </InfoText>
          <InfoPictureWrapper>
            <InfoPicture src={picture} />
          </InfoPictureWrapper>
        </InfoSection>
      );
    }
    return (
      <InfoSection>
        <InfoPictureWrapper>
          <InfoPicture src={picture} />
        </InfoPictureWrapper>
        <InfoText>
          <InfoTextTitle>{title}</InfoTextTitle>
          <p>{desc}</p>
        </InfoText>
      </InfoSection>
    );
  }

  render() {
    return (
      <>
        <Header>
          <h1>GraduateNU Staging</h1>
          <LoginButtonContainer>
            <a
              href="https://admin.khoury.northeastern.edu"
              style={{ textDecoration: "none" }}
            >
              <ColorButton variant="contained">Get Started</ColorButton>
            </a>
            {this.dev && (
              <>
                <ColorButton
                  variant="contained"
                  onClick={this.onDevStudentClick.bind(this)}
                >
                  Dev Bypass (Student)
                </ColorButton>
                <ColorButton
                  variant="contained"
                  onClick={this.onDevAdvisorClick.bind(this)}
                >
                  Dev Bypass (Advisor)
                </ColorButton>
              </>
            )}
          </LoginButtonContainer>
        </Header>
        <Banner>
          <BannerInfo>
            <BannerInfoTitle>Graduate on time.</BannerInfoTitle>
            <BannerInfoText>
              Navigate the Northeastern graduation requirements and create a
              personalized plan of study.
            </BannerInfoText>
            <a
              href="https://admin.khoury.northeastern.edu"
              style={{ textDecoration: "none" }}
            >
              <WhiteColorButton variant="contained">
                Get Started
              </WhiteColorButton>
            </a>
          </BannerInfo>
          <TitlePicture src={titlePicture} alt="title-picture"></TitlePicture>
        </Banner>
        <Body>
          {this.renderInfoSection(
            "Start!",
            "Just answer a couple questions and get started with a multi-year plan for your classes.",
            picture1
          )}
          {this.renderInfoSection(
            "Personalize",
            "Pick the classes you want. We’ll take care of NU Path, pre-requisites, and everything in between.",
            picture2,
            true
          )}
          {this.renderInfoSection(
            "Graduate",
            "Build a plan of study that lets you graduate faster, with better classes, and a lot less headaches.",
            picture3
          )}
        </Body>
        <Footer>
          <a
            href="https://admin.khoury.northeastern.edu"
            style={{ textDecoration: "none" }}
          >
            <WhiteColorButton variant="contained">Get Started</WhiteColorButton>
          </a>
        </Footer>
      </>
    );
  }
}
