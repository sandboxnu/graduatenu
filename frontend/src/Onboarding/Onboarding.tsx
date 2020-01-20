import React from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { GraduateGrey } from "../constants";
import { Button, Card } from "@material-ui/core";
import picture from "../assets/landingils.png";
import { connect } from "react-redux";
import { getFullNameFromState } from "../state";
import { AppState } from "../state/reducers/state";
import { Dispatch, bindActionCreators } from "redux";
import { fetchMajorsAndPlans } from "../utils/fetchMajorsAndPlans";

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

const GraduateLogo = styled.img`
  height: 250px;
  width: 175px;
  align-self: center;
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

interface OnboardingProps {
  fullName: string;
  fetchMajorsAndPlans: typeof fetchMajorsAndPlans;
}

class OnboardingComponent extends React.Component<OnboardingProps> {
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

  componentWillMount() {
    const { fetchMajorsAndPlans } = this.props;
    fetchMajorsAndPlans();
  }

  render() {
    // fullName will be an empty string if this is the user's first time visiting the site
    if (!!this.props.fullName) {
      return <Redirect to="/home" />;
    }

    return (
      <Container>
        <Header></Header>
        <Body>
          <BodyText>
            <TitleText>Graduate on time.</TitleText>
            <DescriptionText>
              Navigate the Northeastern graduation requirements
              and build a personalized plan of study.
            </DescriptionText>
            <Link
              to={{ pathname: "/name", state: { userData: {} } }}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" color="secondary">
                Get Started
              </Button>
            </Link>
          </BodyText>
          <GraduateLogo src={picture} alt="picture"></GraduateLogo>
        </Body>
        <ContentWrapper>
          <ContentWall></ContentWall>
          <Content>
            {this.renderInfoCard(
              "Start",
              "Just answer a couple questions and get started with a multi-year plan for your classes."
            )}
            {this.renderInfoCard(
              "Personalize",
              "Pick the classes you want. We’ll take care of the NUPaths, prereqs, and everything in between."
            )}
            {this.renderInfoCard(
              "Graduate",
              "Build a plan of study that lets you graduate faster, with better classes, and lot less headaches."
            )}
          </Content>
          <ContentWall></ContentWall>
        </ContentWrapper>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  fullName: getFullNameFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchMajorsAndPlans: fetchMajorsAndPlans,
    },
    dispatch
  );

export const Onboarding = connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingComponent);
