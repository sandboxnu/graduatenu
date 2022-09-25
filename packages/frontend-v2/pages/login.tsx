import { NextPage } from "next";
import { HeaderContainer, Logo, SignIn } from "../components";
import { LoginForm } from "../components/Form";

const Login: NextPage = () => {
  return (
    <>
      <Header />
      <LoginForm />
    </>
  );
};

const Header = (): JSX.Element => (
  <HeaderContainer>
    <Logo />
    <SignIn />
    </HeaderContainer>
);

export default Login;
