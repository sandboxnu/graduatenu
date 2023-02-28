import { Button, Flex, Link, Text} from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import { GraduateHeader } from "../components/Header/GraduateHeader";
import { logout } from "../utils";
import { NextPage } from "next";


const EmailConfirmation: NextPage = () => {
  return (
    <div>
      <GraduateHeader
        rightContent={<Link onClick={() => router.push("/login")}>Log In</Link>}
      />
      <Flex direction="column">
        <Text fontSize="xl" textAlign="center">
          We sent you an email. Click the link in your email to activate your account.
        </Text>
        <Link onClick={ ()=> console.log("hi")}>
        Didn't get the email? Click here to resend.
        </Link>
      </Flex>
    </div>
  );
};

export default EmailConfirmation;
