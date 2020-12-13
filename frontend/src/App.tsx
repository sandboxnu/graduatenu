import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Onboarding } from "./Onboarding/Onboarding";
import { HomeWrapper } from "./home/HomeWrapper";
import { OnboardingInfoScreen } from "./Onboarding/OnboardingInfoScreen";
import { CompletedCoursesScreen } from "./Onboarding/CompletedCoursesScreen";
import { Provider } from "react-redux";
import { Store } from "redux";
import { TransferCoursesScreen } from "./Onboarding/TransferCoursesScreen";
import { Profile } from "./profile/Profile";
import { ManageStudents } from "./advising/ManageStudents";
import { NotificationsPage } from "./advising/Notifications";
import { TemplatesPage } from "./advising/Templates";
import { GenericAdvisingTemplateComponent } from "./advising/GenericAdvisingTemplate";
import TransferableCreditScreen from "./Onboarding/TransferableCreditScreen";
import { RedirectScreen } from "./Onboarding/RedirectScreen";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute";
import { UnprotectedRoute } from "./components/Routes/UnprotectedRoute";

export const App = ({ store }: { store: Store }) => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          {/* requires login */}
          <ProtectedRoute path="/home" component={HomeWrapper} />
          <ProtectedRoute path="/redirect" component={RedirectScreen} />
          <ProtectedRoute path="/onboarding" component={OnboardingInfoScreen} />
          {/* ****FOR TESTING! DELETE BEFORE MERGING **** */}
          <ProtectedRoute path="/profile" component={NotificationsPage} />
          <ProtectedRoute
            path="/completedCourses"
            component={CompletedCoursesScreen}
          />
          <ProtectedRoute
            path="/transferCourses"
            component={TransferCoursesScreen}
          />
          <ProtectedRoute
            path="/transferableCredits"
            component={TransferableCreditScreen}
          />
          <ProtectedRoute path="/advisor" component={AdvisorRouter} />

          {/* requires not logged in */}
          <UnprotectedRoute path="/" component={Onboarding} />
          {/* <Route path="/signup" component={SignupScreen} />
             <Route path="/login" component={LoginScreen} /> */}
        </Switch>
      </Router>
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
