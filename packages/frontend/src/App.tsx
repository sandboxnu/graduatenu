import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { RequireAuth } from "./components/Routes/ProtectedRoute";
import { StudentsList } from "./advising/ManageStudents/StudentsList";
import { TemplateBuilderPage } from "./advising/Templates/TemplateBuilderPage";
import { CourseManagmentPage } from "./advising/CourseManagment";
import { GenericStudentView } from "./advising/ManageStudents/GenericStudentView";
import { LoginScreen } from "./Onboarding/LoginScreen";
import { SignupScreen } from "./Onboarding/SignupScreen";
import ErrorHandler from "./error/ErrorHandler";
import { ErrorBoundary } from "react-error-boundary";
import { FrontendErrorPage } from "./error/ErrorPages";

export const App = ({ store }: { store: Store }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={FrontendErrorPage}>
          <ErrorHandler>
            <Routes>
              <Route element={<RequireAuth />}>
                {/* requires login */}
                <Route path="/home" element={<HomeWrapper />} />
                <Route path="/redirect" element={<RedirectScreen />} />
                <Route path="/onboarding" element={<OnboardingInfoScreen />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/management" element={<CourseManagmentPage />} />
                <Route
                  path="/completedCourses"
                  element={<CompletedCoursesScreen />}
                />
                <Route
                  path="/transferCourses"
                  element={<TransferCoursesScreen />}
                />
                <Route
                  path="/transferableCredits"
                  element={<TransferableCreditScreen/>}
                />
                {/* <Route path="/advisor" element={<AdvisorRouter />} /> */}
              </Route>
              {/* requires not logged in */}
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/" element={<LandingScreen />} />
            </Routes>
          </ErrorHandler>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AdvisorRouter = (props: any) => {
  const { path } = props.match;

  return (
    <GenericAdvisingTemplateComponent>
      <Routes>
        <Route path={`${path}/appointments`} element={AppointmentsPage} />
        <Route path={`${path}/manageStudents`} element={StudentsList} />
        <Route
          path={`${path}/manageStudents/:id/expanded/:planId`}
          element={GenericStudentView}
        />
        <Route
          path={`${path}/manageStudents/:id`}
          element={GenericStudentView}
        />
        <Route path={`${path}/templates`} element={TemplatesListPage} />
        <Route
          path={`${path}/templates/templateBuilder/:templateId`}
          element={TemplateBuilderPage}
        />
        <Route
          path={`${path}/templates/createTemplate`}
          element={NewTemplatesPage}
        />
      </Routes>
    </GenericAdvisingTemplateComponent>
  );
};
