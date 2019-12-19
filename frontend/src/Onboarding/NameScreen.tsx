import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { setFullNameAction } from "../state/actions/userActions";
import { getMajors, getMajorsLoadingFlag, getMajorsError } from "../state";
import { fetchMajors } from "../utils/fetchMajors";
import { Major } from "../models/types";
import Loader from "react-loader-spinner";
import { AppState } from "../state/reducers/state";

interface NameScreenProps {
  setFullName: (fullName: string) => void;
  fetchMajors: typeof fetchMajors;
  isFetchingMajors: boolean;
  majors: Major[];
  majorsError: string;
}

interface NameScreenState {
  textFieldStr: string;
  beenEdited: boolean;
}

type Props = NameScreenProps & RouteComponentProps;

class NameComponent extends React.Component<Props, NameScreenState> {
  constructor(props: Props) {
    super(props);
    this.shouldComponentRender = this.shouldComponentRender.bind(this);

    this.state = {
      textFieldStr: "",
      beenEdited: false,
    };
  }

  componentWillMount() {
    console.log("componentWillMount");
    const { fetchMajors } = this.props;
    fetchMajors();
  }

  shouldComponentRender() {
    console.log("shouldComponentRender");
    const { isFetchingMajors } = this.props;
    if (isFetchingMajors === false) return false;
    // more tests
    return true;
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      textFieldStr: e.target.value,
      beenEdited: true,
    });
  }

  render() {
    const { textFieldStr, beenEdited } = this.state;
    const { isFetchingMajors } = this.props;
    // const { isFetchingMajors, majors } = this.props;
    // // console.log(isFetchingMajors);
    // // console.log(majors);
    if (isFetchingMajors) {
      return (
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={5000} //5 secs
        />
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
  majorsError: getMajorsError(state),
  majors: getMajors(state),
  isFetchingMajors: getMajorsLoadingFlag(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchMajors: fetchMajors,
      setFullName: setFullNameAction,
    },
    dispatch
  );

export const NameScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NameComponent));
