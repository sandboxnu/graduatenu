import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LandingScreen } from "./Onboarding/LandingScreen";
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
import { TemplateBuilderPage } from "./advising/Templates/TemplateBuilderPage";
import { CourseManagmentPage } from "./advising/CourseManagment";
import { GenericStudentView } from "./advising/ManageStudents/GenericStudentView";
import { LoginScreen } from "./Onboarding/LoginScreen";
import { SignupScreen } from "./Onboarding/SignupScreen";
import ErrorHandler from "./error/ErrorHandler";

export const App = ({ store }: { store: Store }) => {
  return (
    <Provider store={store}>
      <Router>
        <ErrorHandler>
          <Switch>
            {/* requires login */}
            <ProtectedRoute path="/home" component={HomeWrapper} />
            <ProtectedRoute path="/redirect" component={RedirectScreen} />
            <ProtectedRoute
              path="/onboarding"
              component={OnboardingInfoScreen}
            />
            <ProtectedRoute path="/profile" component={Profile} />
            <ProtectedRoute
              path="/management"
              component={CourseManagmentPage}
            />
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
            <UnprotectedRoute path="/login" component={LoginScreen} />
            <UnprotectedRoute path="/signup" component={SignupScreen} />
            <UnprotectedRoute path="/" component={LandingScreen} />
          </Switch>
        </ErrorHandler>
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
          path={[
            `${path}/manageStudents/:id`,
            `${path}/manageStudents/:id/expanded/:planId`,
          ]}
          component={GenericStudentView}
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
