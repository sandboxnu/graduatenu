import { Image } from "@chakra-ui/react";
import Link from "next/link";

export const Logo = (): JSX.Element => {
  return (
    <Link href="/" passHref>
      <Image
        src="/logo.svg"
        objectFit="contain"
        boxSize="50"
        alt="GraduateNU logo"
        width="50"
      />
    </Link>
  );
};
