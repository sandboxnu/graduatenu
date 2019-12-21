import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { setFullNameAction } from "../state/actions/userActions";
import { getMajorsLoadingFlag, getPlansLoadingFlag } from "../state";
import { fetchMajors } from "../utils/fetchMajors";
import { fetchPlans } from "../utils/fetchPlans";
import Loader from "react-loader-spinner";
import { AppState } from "../state/reducers/state";
import styled from "styled-components";

interface NameScreenProps {
  setFullName: (fullName: string) => void;
  fetchMajors: typeof fetchMajors;
  fetchPlans: typeof fetchPlans;
  isFetchingMajors: boolean;
  isFetchingPlans: boolean;
}

interface NameScreenState {
  textFieldStr: string;
  beenEdited: boolean;
}

type Props = NameScreenProps & RouteComponentProps;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 700px;
`;

class NameComponent extends React.Component<Props, NameScreenState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      textFieldStr: "",
      beenEdited: false,
    };
  }

  componentWillMount() {
    const { fetchMajors, fetchPlans } = this.props;
    fetchMajors();
    fetchPlans();
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      textFieldStr: e.target.value,
      beenEdited: true,
    });
  }

  render() {
    const { textFieldStr, beenEdited } = this.state;
    const { isFetchingMajors, isFetchingPlans } = this.props;
    if (isFetchingMajors || isFetchingPlans) {
      return (
        <SpinnerWrapper>
          <Loader
            type="Puff"
            color="#f50057"
            height={100}
            width={100}
            timeout={5000} //5 secs
          />
        </SpinnerWrapper>
      );
    } else {
      return (
        <GenericQuestionTemplate question="What is your full name?">
          <TextField
            id="standard-basic"
            value={textFieldStr}
            onChange={this.onChange.bind(this)}
            placeholder="John Smith"
            error={textFieldStr.length === 0 && beenEdited}
            helperText={
              textFieldStr.length === 0 &&
              beenEdited &&
              "Please enter a valid name"
            }
          />
          {textFieldStr.length !== 0 ? (
            <Link
              to={{
                pathname: "/academicYear",
              }}
              onClick={() => this.props.setFullName(this.state.textFieldStr)}
              style={{ textDecoration: "none" }}
            >
              <NextButton />
            </Link>
          ) : (
            <div onClick={() => this.setState({ beenEdited: true })}>
              <NextButton />
            </div>
          )}
        </GenericQuestionTemplate>
      );
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  isFetchingMajors: getMajorsLoadingFlag(state),
  isFetchingPlans: getPlansLoadingFlag(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchMajors: fetchMajors,
      fetchPlans: fetchPlans,
      setFullName: setFullNameAction,
    },
    dispatch
  );

export const NameScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NameComponent));
