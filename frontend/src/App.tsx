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
import { TransferCoursesScreen } from "./Onboarding/TransferCoursesScreen";
import { Profile } from "./profile/Profile";
import { ManageStudents } from "./advising/ManageStudents";
import { NotificationsPage } from "./advising/Notifications";
import { TemplatesPage } from "./advising/Templates";
import { GenericAdvisingTemplateComponent } from "./advising/GenericAdvisingTemplate";
import TransferableCreditScreen from "./Onboarding/TransferableCreditScreen";
import { RedirectScreen } from "./Onboarding/RedirectScreen";

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
            <Route path="/redirect" component={RedirectScreen} />
            <Route path="/onboarding" component={OnboardingInfoScreen} />
            <Route path="/profile" component={Profile} />
            <Route
              path="/completedCourses"
              component={CompletedCoursesScreen}
            />
            <Route path="/transferCourses" component={TransferCoursesScreen} />
            <Route
              path="/transferableCredits"
              component={TransferableCreditScreen}
            />
            <Route path="/advisor" component={AdvisorRouter} />
            <Route path="/" component={Onboarding} />
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  );
};

const AdvisorRouter = (props: any) => {
  const { path } = props.match;

  return (
    <GenericAdvisingTemplateComponent>
      <Switch>
        <Route path={`${path}/notifications`} component={NotificationsPage} />
        <Route path={`${path}/manageStudents`} component={ManageStudents} />
        <Route path={`${path}/templates`} component={TemplatesPage} />
      </Switch>
    </GenericAdvisingTemplateComponent>
  );
};
