import { NextPage } from "next";
import { HeaderContainer, Logo } from "../components";
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
    <h1>Side things</h1>
  </HeaderContainer>
);

export default Login;
