import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Onboarding } from "./Onboarding/Onboarding";
import { HomeWrapper } from "./home/HomeWrapper";
import { NameScreen } from "./Onboarding/NameScreen";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/home" component={HomeWrapper} />
          <Route path="/name" component={NameScreen} />
          <Route path="/" component={Onboarding} />
        </Switch>
      </Router>
    );
  }
}
