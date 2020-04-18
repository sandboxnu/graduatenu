import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Onboarding } from "./Onboarding/Onboarding";
import { HomeWrapper } from "./home/HomeWrapper";
<<<<<<< HEAD
import { OnboardingInfoScreen } from "./Onboarding/OnboardingInfoScreen";
=======
import { NameScreen } from "./Onboarding/NameScreen";
import { AcademicYearScreen } from "./Onboarding/AcademicYearScreen";
import { GraduationYearScreen } from "./Onboarding/GraduationYearScreen";
import { MajorScreen } from "./Onboarding/MajorScreen";
import { SignupScreenComponent } from "./Onboarding/SignupScreen";
>>>>>>> basic signup ui
import { Provider } from "react-redux";
import { Store } from "redux";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor } from "redux-persist";

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
<<<<<<< HEAD
            <Route path="/onboarding" component={OnboardingInfoScreen} />
=======
            <Route path="/name" component={NameScreen} />
            <Route path="/academicYear" component={AcademicYearScreen} />
            <Route path="/graduationYear" component={GraduationYearScreen} />
            <Route path="/major" component={MajorScreen} />
            <Route path="/signup" component={SignupScreenComponent} />
>>>>>>> basic signup ui
            <Route path="/" component={Onboarding} />
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  );
};
