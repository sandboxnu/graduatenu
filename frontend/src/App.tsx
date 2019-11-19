import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Onboarding } from "./Onboarding/Onboarding";
import { Home } from "./home/Home";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/" component={Onboarding} />
        </Switch>
      </Router>
    );
  }
}
