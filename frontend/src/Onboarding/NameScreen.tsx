import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { TextField, Button } from "@material-ui/core";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  height: 20%;
  width: 30%;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2``;

const Question = styled.p``;

const MyButton = styled(Button)`
  align-self: center;
`;

type PathParamsType = {
  param1: string;
};

type Props = RouteComponentProps<PathParamsType> & {
  someString: string;
};

interface State {
  textFieldStr: string;
}

class NameComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      textFieldStr: "",
    };
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      textFieldStr: e.target.value,
    });
  }

  render() {
    return (
      <Wrapper>
        <Box>
          <Title>Get Started</Title>
          <Question>What is your full name?</Question>
          <TextField
            id="standard-basic"
            label="Standard"
            value={this.state.textFieldStr}
            onChange={this.onChange.bind(this)}
          />
          <Link
            to={{
              pathname: "/home",
              state: { fullName: this.state.textFieldStr },
            }}
          >
            <MyButton>Next</MyButton>
          </Link>
        </Box>
      </Wrapper>
    );
  }
}

export const NameScreen = withRouter(NameComponent);
