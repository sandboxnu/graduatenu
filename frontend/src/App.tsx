import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Onboarding } from "./Onboarding/Onboarding";
import { HomeWrapper } from "./home/HomeWrapper";
import { OnboardingInfoScreen } from "./Onboarding/OnboardingInfoScreen";
import { CompletedCoursesScreen } from "./Onboarding/CompletedCoursesScreen";
import { Provider } from "react-redux";
import { Store } from "redux";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor } from "redux-persist";
import { SignupScreen } from "./Onboarding/SignupScreen";
import { LoginScreen } from "./Onboarding/LoginScreen";
import { TransferCoursesScreen } from "./Onboarding/TransferCoursesScreen";
import { Profile } from "./profile/Profile";

export const App = ({
  store,
  persistor,
}: {
  store: Store;
  persistor: Persistor;
}) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Switch>
            <Route path="/home" component={HomeWrapper} />
            <Route path="/onboarding" component={OnboardingInfoScreen} />
            <Route path="/signup" component={SignupScreen} />
            <Route path="/login" component={LoginScreen} />
            <Route path="/profile" component={Profile} />
            <Route
              path="/completedCourses"
              component={CompletedCoursesScreen}
            />
            <Route path="/transferCourses" component={TransferCoursesScreen} />
            <Route path="/" component={Onboarding} />
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  );
};
