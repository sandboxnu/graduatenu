import {} from "@chakra-ui/react";
import { NextPage } from "next";
import { HeaderContainer, Logo } from "../components";
import { SignUpForm } from "../components/Form/SignUpForm";

const Signup: NextPage = () => {
  return (
    <>
      <Header />
      <SignUpForm />
    </>
  );
};

const Header = (): JSX.Element => {
  return (
    <HeaderContainer>
      <Logo />
    </HeaderContainer>
  );
};

export default Signup;
