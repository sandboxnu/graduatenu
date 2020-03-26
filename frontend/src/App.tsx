import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Onboarding } from "./Onboarding/Onboarding";
import { HomeWrapper } from "./home/HomeWrapper";
import { NameScreen } from "./Onboarding/NameScreen";
import { AcademicYearScreen } from "./Onboarding/AcademicYearScreen";
import { GraduationYearScreen } from "./Onboarding/GraduationYearScreen";
import { MajorScreen } from "./Onboarding/MajorScreen";
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
            <Route path="/name" component={NameScreen} />
            <Route path="/academicYear" component={AcademicYearScreen} />
            <Route path="/graduationYear" component={GraduationYearScreen} />
            <Route path="/major" component={MajorScreen} />
            <Route path="/" component={Onboarding} />
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  );
};
