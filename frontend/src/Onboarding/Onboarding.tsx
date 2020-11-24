import React from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { Button, Theme, withStyles } from "@material-ui/core";
import titlePicture from "../assets/onboarding-title.png";
import picture1 from "../assets/onboarding-1.png";
import picture2 from "../assets/onboarding-2.png";
import picture3 from "../assets/onboarding-3.png";
import { connect } from "react-redux";
import { getFullNameFromState } from "../state";
import { AppState } from "../state/reducers/state";
import { Dispatch, bindActionCreators } from "redux";
import { fetchMajorsAndPlans as fMAP } from "../utils/fetchMajorsAndPlans";
import { NORTHEASTERN_RED } from "../constants";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 5%;
  padding-right: 5%;
  justify-content: space-between;
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

const LoginLink = styled(Link)`
  align-self: center;
  margin-right: 8px !important;
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

interface OnboardingProps {
  fullName: string;
  fetchMajorsAndPlans: typeof fMAP; // using type of here to annotate the prop with it's correct type
}

class OnboardingComponent extends React.Component<OnboardingProps> {
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

  componentWillMount() {
    // make an API request to searchNEU to get the supported majors and their corresponding plans.
    this.props.fetchMajorsAndPlans();
  }

  render() {
    // fullName will be an empty string if this is the user's first time visiting the site
    if (!!this.props.fullName) {
      return <Redirect to="/home" />;
    }

    return (
      <>
        <Header>
          <h1>GraduateNU</h1>
          <LoginLink
            to={{ pathname: "/login", state: { fromOnBoarding: true } }}
            style={{ textDecoration: "none" }}
          >
            <ColorButton variant="contained">Login</ColorButton>
          </LoginLink>
        </Header>
        <Banner>
          <BannerInfo>
            <BannerInfoTitle>Graduate on time.</BannerInfoTitle>
            <BannerInfoText>
              Navigate the Northeastern graduation requirements and create a
              personalized plan of study.
            </BannerInfoText>
            <LoginLink
              to={{ pathname: "/onboarding" }}
              style={{ textDecoration: "none", alignSelf: "flex-start" }}
            >
              <WhiteColorButton variant="contained">
                Get Started
              </WhiteColorButton>
            </LoginLink>
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
          <LoginLink
            to={{ pathname: "/advisor/templates" }}
            style={{ textDecoration: "none", alignSelf: "flex-end" }}
          >
            <WhiteColorButton variant="contained">Get Started</WhiteColorButton>
          </LoginLink>
        </Footer>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  fullName: getFullNameFromState(state),
});

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchMajorsAndPlans: fMAP,
    },
    dispatch
  );

/**
 * Convert this React component to a component that's connected to the redux store.
 * When rendering the connecting component, the props assigned in mapStateToProps, do not need to
 * be passed down as props from the parent component.
 */
export const Onboarding = connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingComponent);
