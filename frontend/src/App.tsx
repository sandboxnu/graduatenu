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
import { AppointmentsPage } from "./advising/Appointments";
import { TemplatesListPage } from "./advising/Templates/TemplateListPage";
import { NewTemplatesPage } from "./advising/Templates/TemplateInfoPage";
import { GenericAdvisingTemplateComponent } from "./advising/GenericAdvisingTemplate";
import TransferableCreditScreen from "./Onboarding/TransferableCreditScreen";
import { RedirectScreen } from "./Onboarding/RedirectScreen";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute";
import { UnprotectedRoute } from "./components/Routes/UnprotectedRoute";
import { StudentsList } from "./advising/ManageStudents/StudentsList";
import { StudentView } from "./advising/ManageStudents/StudentView";
import { ExpandedStudentView } from "./advising/ManageStudents/ExpandedStudentView";
import { TemplateBuilderPage } from "./advising/Templates/TemplateBuilderPage";

export const App = ({ store }: { store: Store }) => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          {/* requires login */}
          <ProtectedRoute path="/home" component={HomeWrapper} />
          <ProtectedRoute path="/redirect" component={RedirectScreen} />
          <ProtectedRoute path="/onboarding" component={OnboardingInfoScreen} />
          <ProtectedRoute path="/profile" component={Profile} />
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
        <Route path={`${path}/appointments`} component={AppointmentsPage} />
        <Route exact path={`${path}/manageStudents`} component={StudentsList} />
        <Route
          exact
          path={`${path}/manageStudents/:id`}
          component={StudentView}
        />
        <Route
          exact
          path={`${path}/manageStudents/:id/expanded/:planId`}
          component={ExpandedStudentView}
        />
        <Route exact path={`${path}/templates`} component={TemplatesListPage} />
        <Route
          exact
          path={`${path}/templates/templateBuilder/:templateId`}
          component={TemplateBuilderPage}
        />
        <Route
          exact
          path={`${path}/templates/createTemplate`}
          component={NewTemplatesPage}
        />
      </Switch>
    </GenericAdvisingTemplateComponent>
  );
};
